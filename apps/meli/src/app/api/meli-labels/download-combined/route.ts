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

    const shipments: Array<{ shipment_id: number; meli_user_id: string }> = [];
    const seenSids = new Set<number>();
    for (const r of records) {
      if (!seenSids.has(r.shipment_id)) {
        seenSids.add(r.shipment_id);
        shipments.push({ shipment_id: r.shipment_id, meli_user_id: String(r.meli_user_id) });
      }
    }

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

    interface LabelPage { doc: PDFDocument; pageIdx: number }
    const individualLabels: LabelPage[] = [];

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
            return { doc: await PDFDocument.load(buf, { ignoreEncryption: true }), pageIdx: 0 } as LabelPage;
          } catch { return null; }
        })
      );
      for (const r of results) {
        if (r) individualLabels.push(r);
      }
    }

    if (individualLabels.length === 0) {
      const uniqueUrls: string[] = Array.from(new Set(
        records.map((r: { file_path: string }) => r.file_path).filter(Boolean)
      ));
      const pdfDoc = await PDFDocument.create();
      for (const url of uniqueUrls) {
        try {
          const response = await fetch(url);
          if (!response.ok) continue;
          const src = await PDFDocument.load(await response.arrayBuffer(), { ignoreEncryption: true });
          const pages = await pdfDoc.copyPages(src, src.getPageIndices());
          pages.forEach(p => pdfDoc.addPage(p));
        } catch { /* skip */ }
      }
      if (pdfDoc.getPageCount() === 0) {
        return NextResponse.json({ error: "No se pudieron obtener las etiquetas" }, { status: 502 });
      }
      return new NextResponse(Buffer.from(await pdfDoc.save()), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="etiquetas-${new Date().toISOString().slice(0, 10)}.pdf"`,
        },
      });
    }

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

        const scale = Math.min(slotW / srcW, slotH / srcH, 1);
        const drawW = srcW * scale;
        const drawH = srcH * scale;

        const x = MARGIN_X + j * (slotW + GAP_X) + (slotW - drawW) / 2;
        const y = MARGIN_Y + (slotH - drawH) / 2;

        const embedded = await pdfDoc.embedPage(srcPage);
        a4Page.drawPage(embedded, { x, y, width: drawW, height: drawH });
      }
    }

    return new NextResponse(Buffer.from(await pdfDoc.save()), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="etiquetas-${new Date().toISOString().slice(0, 10)}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Download combined error:", error);
    return NextResponse.json(
      { error: `Error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
