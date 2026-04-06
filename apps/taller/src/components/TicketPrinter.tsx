"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Printer, X } from "lucide-react";
import { VentaItem, MetodoPago } from "@/lib/types";

interface Props {
  isOpen: boolean;
  venta: {
    items: VentaItem[];
    total: number;
    metodoPago: MetodoPago;
    createdAt: string;
  };
  clientData?: {
    nombre?: string;
    dni?: string;
    direccion?: string;
    telefono?: string;
  };
  onClose: () => void;
}

export default function TicketPrinter({ isOpen, venta, clientData, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const formatCurrency = (n: number) =>
    "$" + n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clientName = clientData?.nombre || "Consumidor Final";
  const clientDni = clientData?.dni || "-";
  const clientDir = clientData?.direccion || "-";
  const clientTel = clientData?.telefono || "-";

  // Componente del comprobante para imprimir
  const ComprobanteA4 = (
    <div
      id="comprobante-a4"
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        color: "#333",
        padding: "20px",
        border: "1px solid #ddd",
        background: "white",
      }}
    >
      {/* Encabezado */}
      <table style={{ width: "100%", marginBottom: "20px", borderBottom: "2px solid #000", paddingBottom: "10px" }}>
        <tbody>
          <tr>
            <td style={{ width: "50%" }}>
              <h1 style={{ margin: "0", color: "#000", fontSize: "28px" }}>MAQJEEZ</h1>
              <p style={{ margin: "5px 0", fontWeight: "bold", fontSize: "12px" }}>
                Venta de Maquinaria y Servicios Técnicos
              </p>
              <p style={{ margin: "0", fontSize: "11px", color: "#666" }}>
                Carlos Spegazzini, Ezeiza - Buenos Aires
              </p>
            </td>
            <td style={{ width: "50%", textAlign: "right", verticalAlign: "top" }}>
              <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>COMPROBANTE DE VENTA</h3>
              <p style={{ margin: "5px 0", fontSize: "11px", color: "#666" }}>
                Fecha: {formatDateTime(venta.createdAt)}
              </p>
              <div
                style={{
                  display: "inline-block",
                  border: "2px solid #000",
                  padding: "8px",
                  marginTop: "5px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                NO VÁLIDO COMO FACTURA
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Datos del Cliente */}
      <div
        style={{
          margin: "20px 0",
          padding: "10px",
          backgroundColor: "#f9f9f9",
          borderRadius: "5px",
          border: "1px solid #e0e0e0",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", borderBottom: "1px solid #ccc", fontSize: "13px", fontWeight: "bold" }}>
          Datos del Cliente
        </h4>
        <table style={{ width: "100%", fontSize: "12px" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%" }}>
                <strong>Nombre:</strong> {clientName}
              </td>
              <td style={{ width: "50%" }}>
                <strong>DNI/CUIT:</strong> {clientDni}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Dirección:</strong> {clientDir}
              </td>
              <td>
                <strong>Teléfono:</strong> {clientTel}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tabla de Productos */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#000", color: "#fff" }}>
            <th style={{ padding: "10px", textAlign: "left", border: "1px solid #000", width: "10%" }}>Cant.</th>
            <th style={{ padding: "10px", textAlign: "left", border: "1px solid #000", width: "45%" }}>
              Descripción del Producto / Servicio
            </th>
            <th style={{ padding: "10px", textAlign: "right", border: "1px solid #000", width: "20%" }}>Precio Unit.</th>
            <th style={{ padding: "10px", textAlign: "right", border: "1px solid #000", width: "25%" }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {venta.items.map((item) => (
            <tr key={item.id}>
              <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{item.cantidad}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.producto}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "right" }}>
                {formatCurrency(item.precioUnit)}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "right", fontWeight: "bold" }}>
                {formatCurrency(item.subtotal)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} style={{ padding: "10px", textAlign: "right", fontWeight: "bold", fontSize: "14px" }}>
              TOTAL:
            </td>
            <td
              style={{
                padding: "10px",
                textAlign: "right",
                fontWeight: "bold",
                fontSize: "16px",
                border: "2px solid #000",
                backgroundColor: "#f0f0f0",
              }}
            >
              {formatCurrency(venta.total)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Pie */}
      <div style={{ marginTop: "50px", textAlign: "center", fontSize: "11px", color: "#777" }}>
        <p>Gracias por confiar en MaqJeez para sus herramientas y servicios técnicos.</p>
        <p>Este documento es un resumen de operación comercial interna.</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm print-hidden"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print-hidden">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-gray-900">Comprobante de Venta A4</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable preview */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {ComprobanteA4}
          </div>

          {/* Footer with buttons */}
          <div className="flex gap-2 p-4 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 text-white transition-colors"
              style={{ background: "#2563EB" }}
            >
              <Printer className="w-4 h-4" />
              Imprimir A4
            </button>
          </div>
        </div>
      </div>

      {/* Portal del comprobante para impresión - fuera del modal */}
      {mounted && createPortal(
        <div className="print-only">
          {ComprobanteA4}
        </div>,
        document.body
      )}

      {/* Print styles para A4 */}
      <style>{`
        @media print {
          /* Ocultar todo en la pantalla */
          .print-hidden,
          .fixed,
          div[class*="backdrop-blur"],
          div[class*="bg-black/60"] {
            display: none !important;
          }
          
          /* Mostrar solo el comprobante */
          .print-only {
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
            z-index: 99999 !important;
          }
          
          .print-only #comprobante-a4 {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            border: none !important;
            background: white !important;
            font-family: Arial, sans-serif !important;
            font-size: 12px !important;
            line-height: 1.4 !important;
            color: #000 !important;
          }
          
          .print-only #comprobante-a4 * {
            box-shadow: none !important;
            color: #000 !important;
          }
          
          .print-only #comprobante-a4 table {
            color: #000 !important;
            border-collapse: collapse;
          }
          
          .print-only #comprobante-a4 td, 
          .print-only #comprobante-a4 th {
            color: #000 !important;
          }
          
          @page {
            size: A4;
            margin: 10mm;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
          
          button {
            display: none !important;
          }
        }
        
        /* En pantalla, ocultar el elemento de impresión */
        .print-only {
          display: none;
        }
      `}</style>
    </>
  );
}
