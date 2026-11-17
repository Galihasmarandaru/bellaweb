import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { InvoicePdfData } from '../types/invoice.types';

interface JsPdfWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

export const generatePdf = (data: InvoicePdfData, subTotal: number) => {
  const doc: JsPdfWithAutoTable = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // 1. Header Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.text('INVOICE', 15, 30);

  doc.setFontSize(18);
  doc.text('BELLA RHEMA AGNESIA', 195, 25, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('KOL', 195, 32, { align: 'right' });

  // Divider Line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(15, 40, 195, 40);

  // 2. Info Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('KEPADA :', 15, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(data.kepada || '-', 15, 55);

  doc.setFont('helvetica', 'bold');
  doc.text('TANGGAL :', 195, 50, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(data.tanggal || '-', 195, 55, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('NO INVOICE :', 195, 65, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(data.noInvoice || '-', 195, 70, { align: 'right' });

  // 3. Table Section
  const tableData = data.items.map((item) => [
    item.keterangan,
    item.harga === 0 ? '-' : `RP ${item.harga.toLocaleString('id-ID')}`,
    item.jml.toString(),
    `RP ${(item.harga * item.jml).toLocaleString('id-ID')}`,
  ]);

  autoTable(doc, {
    startY: 85,
    head: [['KETERANGAN', 'HARGA', 'JML', 'TOTAL']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 'auto', halign: 'left' },
      1: { cellWidth: 40, halign: 'center' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 40, halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [235, 235, 235],
    },
  });

  // Calculate final Y position after table
  const finalY = (doc.lastAutoTable?.finalY ?? 120) + 15;

  // 4. Footer Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PEMBAYARAN :', 15, finalY);

  doc.setFont('helvetica', 'normal');
  doc.text('Nama : Bella Rhema Agnesia', 15, finalY + 6);
  doc.text('No Rek : 0091816716 (BCA)', 15, finalY + 12);

  // Totals
  doc.setFont('helvetica', 'normal');
  doc.text('SUB TOTAL :', 145, finalY, { align: 'right' });
  doc.text(`RP ${subTotal.toLocaleString('id-ID')}`, 195, finalY, { align: 'right' });

  doc.text('PAJAK :', 145, finalY + 6, { align: 'right' });
  doc.text('-', 195, finalY + 6, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL :', 145, finalY + 14, { align: 'right' });
  doc.text(`RP ${subTotal.toLocaleString('id-ID')}`, 195, finalY + 14, { align: 'right' });

  // 5. Signature Section
  const signatureY = finalY + 50;
  doc.setFont('helvetica', 'bold');
  doc.text('TERIMAKASIH ATAS', 15, signatureY);
  doc.text('KERJASAMA ANDA', 15, signatureY + 5);

  doc.setFont('times', 'italic');
  doc.setFontSize(24);
  doc.text('Bella Rhema', 190, signatureY, { align: 'right' });

  doc.setLineWidth(0.3);
  doc.line(130, signatureY + 4, 195, signatureY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Bella Rhema A.', 162.5, signatureY + 10, { align: 'center' });

  // Save PDF
  const sanitizedFileName = (data.noInvoice || 'Draft').replace(/[/\\?%*:|"<>]/g, '-');
  doc.save(`Invoice_${sanitizedFileName}.pdf`);
};
