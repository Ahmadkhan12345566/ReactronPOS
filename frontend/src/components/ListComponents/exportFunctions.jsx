import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export function exportToPDF(data, fileHeader) {
  if (!data || data.length === 0) return;
  
  const doc = new jsPDF();
  const headers = Object.keys(data[0]);
  
  const body = data.map(item => 
    headers.map(key => {
      const value = item[key];
      // Truncate any string longer than 1000 characters
      if (typeof value === 'string' && value.length > 1000) {
        return value.substring(0, 100) + '... [truncated]';
      }
      return value;
    })
  );
  
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
}

export function exportToExcel(data, fileHeader) {
  if (!data || data.length === 0) return;
  
  // Also truncate long strings for Excel export
  const excelData = data.map(item => {
    const processedItem = {};
    Object.keys(item).forEach(key => {
      const value = item[key];
      // Truncate any string longer than 1000 characters for Excel too
      if (typeof value === 'string' && value.length > 1000) {
        processedItem[key] = value.substring(0, 100) + '... [truncated]';
      } else {
        processedItem[key] = value;
      }
    });
    return processedItem;
  });
  
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  XLSX.writeFile(workbook, `${fileHeader}_${new Date().toISOString().slice(0,10)}.xlsx`);
}