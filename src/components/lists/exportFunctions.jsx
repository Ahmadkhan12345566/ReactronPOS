import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

  export function exportToPDF(data, fileHeader) {
  const doc = new jsPDF();
    const headers = Object.keys(data[0]);
    const body = data.map(item => headers.map(h => item[h]));
  autoTable(doc, {
    head: [headers],
    body: body,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
  headStyles: { fillColor: [15, 23, 42], textColor: 255, halign: 'center' },
  columnStyles: {
    0: { cellWidth: 10, halign: 'center' },
    1: { cellWidth: 18 },
    2: { cellWidth: 22 },
    3: { cellWidth: 18 },
    4: { cellWidth: 18 },
    5: { cellWidth: 12, halign: 'right' },
    6: { cellWidth: 12, halign: 'center' },
    7: { cellWidth: 12, halign: 'right' },
    8: { cellWidth: 25, overflow: 'ellipsize' },
    9: { cellWidth: 18 },
    10: { cellWidth: 18 }
  }
  });
  
  doc.save(`${fileHeader}_${new Date().toISOString().slice(0,10)}.pdf`);
};
  export function exportToExcel(data, fileHeader) {
    

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, `${fileHeader}_${new Date().toISOString().slice(0,10)}.xlsx`);
  };