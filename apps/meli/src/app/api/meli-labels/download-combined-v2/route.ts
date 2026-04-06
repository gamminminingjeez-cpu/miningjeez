// v7 - Descarga individual por shipment, luego combina 3 por A4 (multicuenta)
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { getSupabase, getActiveAccounts, getValidToken } from "@/lib/meli";

export const runtime = "nodejs";
export const maxDuration = 60;

async function meliGetRawLong(path: string, token: string, timeoutMs = 20000): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(`https://api.mercadolibre.com${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    return res.arrayBuffer();
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const { ids, meli_user_id } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    const supabase = getSupabase();
    const uniqueIds: string[] = Array.from(new Set(ids));

    let query = supabase
      .from("printed_labels")
      .select("shipment_id, meli_user_id, file_path")
      .in("id", uniqueIds);

    if (meli_user_id && meli_user_id !== "") {
      query = query.eq("meli_user_id", meli_user_id) as typeof query;
    }

    const { data: records, error: dbError } = await query;

    if (dbError || !records || records.length === 0) {
      return NextResponse.json({ error: "Records not found" }, { status: 403 });
    }

    // Dedup shipments
    const shipments: Array<{ shipment_id: number; meli_user_id: string }> = [];
    const seenSids = new Set<number>();
    for (const r of records) {
      if (!seenSids.has(r.shipment_id)) {
        seenSids.add(r.shipment_id);
        shipments.push({ shipment_id: r.shipment_id, meli_user_id: String(r.meli_user_id) });
      }
    }

    // Obtener tokens
    const accounts = await getActiveAccounts();
    const tokenMap = new Map<string, string>();
    const neededUids = new Set(shipments.map(s => s.meli_user_id));
    await Promise.all(
      accounts
        .filter(acc => neededUids.has(String(acc.meli_user_id)))
        .map(async (acc) => {
          const token = await getValidToken(acc);
          if (token) tokenMap.set(String(acc.meli_user_id), token);
        })
    );

    // ── Descargar cada etiqueta individualmente de MeLi ──────────────────
    // Al pedir 1 ID, MeLi devuelve 1 etiqueta por página.
    // Luego las combinamos de a 3 por A4 sin importar la cuenta.
    interface LabelPage { doc: PDFDocument; pageIdx: number }
    const individualLabels: LabelPage[] = [];

    // Procesar en batches de 5 en paralelo para no saturar MeLi
    for (let i = 0; i < shipments.length; i += 5) {
      const batch = shipments.slice(i, i + 5);
      const results = await Promise.all(
        batch.map(async (s) => {
          const token = tokenMap.get(s.meli_user_id);
          if (!token) return null;
          const buf = await meliGetRawLong(
            `/shipment_labels?shipment_ids=${s.shipment_id}&response_type=pdf`,
            token
          );
          if (!buf || buf.byteLength < 100) return null;
          try {
            const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
            return { doc, pageIdx: 0 } as LabelPage;
          } catch { return null; }
        })
      );
      for (const r of results) {
        if (r) individualLabels.push(r);
      }
    }

    // ── Fallback: si MeLi falló, usar PDFs almacenados ───────────────────
    if (individualLabels.length === 0) {
      const uniqueUrls: string[] = Array.from(new Set(
        records.map((r: { file_path: string }) => r.file_path).filter(Boolean)
      ));
      // Fallback: copiar páginas tal como están
      const pdfDoc = await PDFDocument.create();
      for (const url of uniqueUrls) {
        try {
          const response = await fetch(url);
          if (!response.ok) continue;
          const buf = await response.arrayBuffer();
          const src = await PDFDocument.load(buf, { ignoreEncryption: true });
          const pages = await pdfDoc.copyPages(src, src.getPageIndices());
          pages.forEach(p => pdfDoc.addPage(p));
        } catch { /* skip */ }
      }
      if (pdfDoc.getPageCount() === 0) {
        return NextResponse.json({ error: "No se pudieron obtener las etiquetas" }, { status: 502 });
      }
      const bytes = await pdfDoc.save();
      return new NextResponse(Buffer.from(bytes), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="historial-etiquetas-${new Date().toISOString().slice(0, 10)}.pdf"`,
        },
      });
    }

    // ── Combinar 3 etiquetas por hoja A4 landscape ───────────────────────
    // A4 landscape: 841.89 x 595.28 pts
    const A4_W = 841.89;
    const A4_H = 595.28;
    const LABELS_PER_ROW = 3;
    const MARGIN_X = 14;
    const MARGIN_Y = 10;
    const GAP_X = 8;

    const slotW = (A4_W - MARGIN_X * 2 - GAP_X * (LABELS_PER_ROW - 1)) / LABELS_PER_ROW;
    const slotH = A4_H - MARGIN_Y * 2;

    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < individualLabels.length; i += LABELS_PER_ROW) {
      const group = individualLabels.slice(i, i + LABELS_PER_ROW);
      const a4Page = pdfDoc.addPage([A4_W, A4_H]);

      for (let j = 0; j < group.length; j++) {
        const { doc, pageIdx } = group[j];
        const srcPage = doc.getPage(pageIdx);
        const { width: srcW, height: srcH } = srcPage.getSize();

        // Escalar para que quepa en el slot manteniendo proporción
        const scale = Math.min(slotW / srcW, slotH / srcH, 1);
        const drawW = srcW * scale;
        const drawH = srcH * scale;

        // Centrar en el slot
        const x = MARGIN_X + j * (slotW + GAP_X) + (slotW - drawW) / 2;
        const y = MARGIN_Y + (slotH - drawH) / 2;

        const embedded = await pdfDoc.embedPage(srcPage);
        a4Page.drawPage(embedded, { x, y, width: drawW, height: drawH });
      }
    }

    const combinedPdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(combinedPdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="historial-etiquetas-${new Date().toISOString().slice(0, 10)}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Download combined v2 error:", error);
    return NextResponse.json(
      { error: `Error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
