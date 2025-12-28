import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface ExportOptions {
  title?: string;
  filename?: string;
  includeDate?: boolean;
}

/**
 * Export data to PDF
 */
export function exportToPDF(
  data: any[],
  columns: Array<{ header: string; dataKey: string }>,
  options: ExportOptions = {}
): void {
  const doc = new jsPDF();
  const { title = 'Report', filename = 'report', includeDate = true } = options;

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 20);

  // Add date if requested
  if (includeDate) {
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  }

  // Prepare table data
  const tableData = data.map((row) =>
    columns.map((col) => {
      const value = row[col.dataKey];
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      return value?.toString() || '';
    })
  );

  const headers = columns.map((col) => col.header);

  // Add table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: includeDate ? 35 : 25,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 163, 74] }, // Green color
  });

  // Save PDF
  doc.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Export data to Excel
 */
export function exportToExcel(
  data: any[],
  columns: Array<{ header: string; dataKey: string }>,
  options: ExportOptions = {}
): void {
  const { title = 'Report', filename = 'report' } = options;

  // Prepare worksheet data
  const worksheetData = [
    columns.map((col) => col.header), // Header row
    ...data.map((row) =>
      columns.map((col) => {
        const value = row[col.dataKey];
        if (value instanceof Date) {
          return value.toLocaleDateString();
        }
        if (typeof value === 'boolean') {
          return value ? 'Yes' : 'No';
        }
        return value?.toString() || '';
      })
    ),
  ];

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  const colWidths = columns.map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, title);

  // Write file
  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Export data to CSV
 */
export function exportToCSV(
  data: any[],
  columns: Array<{ header: string; dataKey: string }>,
  options: ExportOptions = {}
): void {
  const { filename = 'report' } = options;

  // Prepare CSV data
  const csvRows = [
    columns.map((col) => col.header).join(','), // Header row
    ...data.map((row) =>
      columns
        .map((col) => {
          const value = row[col.dataKey];
          let stringValue = '';
          if (value instanceof Date) {
            stringValue = value.toLocaleDateString();
          } else if (typeof value === 'boolean') {
            stringValue = value ? 'Yes' : 'No';
          } else {
            stringValue = value?.toString() || '';
          }
          // Escape commas and quotes
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(',')
    ),
  ];

  // Create CSV content
  const csvContent = csvRows.join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export case data to PDF
 */
export function exportCaseToPDF(caseData: any): void {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Case Report', 14, 20);
  doc.setFontSize(10);
  doc.text(`Case Number: ${caseData.caseNumber || 'N/A'}`, 14, 30);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 36);

  let yPos = 45;

  // Case Information
  doc.setFontSize(14);
  doc.text('Case Information', 14, yPos);
  yPos += 10;

  const caseInfo = [
    ['Case Type', caseData.caseType || 'N/A'],
    ['Status', caseData.status || 'N/A'],
    ['Date Reported', caseData.dateReported ? new Date(caseData.dateReported).toLocaleDateString() : 'N/A'],
    ['Priority', caseData.priority || 'N/A'],
  ];

  autoTable(doc, {
    body: caseInfo,
    startY: yPos,
    theme: 'grid',
    head: false,
    styles: { fontSize: 9 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Victims
  if (caseData.victims && caseData.victims.length > 0) {
    doc.setFontSize(14);
    doc.text('Victims', 14, yPos);
    yPos += 10;

    const victimData = caseData.victims.map((v: any) => [
      v.firstName || '',
      v.lastName || '',
      v.age?.toString() || '',
      v.gender || '',
    ]);

    autoTable(doc, {
      head: [['First Name', 'Last Name', 'Age', 'Gender']],
      body: victimData,
      startY: yPos,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 163, 74] },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Perpetrators
  if (caseData.perpetrators && caseData.perpetrators.length > 0) {
    doc.setFontSize(14);
    doc.text('Perpetrators', 14, yPos);
    yPos += 10;

    const perpetratorData = caseData.perpetrators.map((p: any) => [
      p.name || '',
      p.age?.toString() || '',
      p.gender || '',
      p.relationshipToVictim || '',
    ]);

    autoTable(doc, {
      head: [['Name', 'Age', 'Gender', 'Relationship']],
      body: perpetratorData,
      startY: yPos,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 163, 74] },
    });
  }

  doc.save(`case-${caseData.caseNumber || 'report'}-${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Bulk export cases
 */
export function bulkExportCases(
  cases: any[],
  format: 'pdf' | 'excel' | 'csv',
  options: ExportOptions = {}
): void {
  const columns = [
    { header: 'Case Number', dataKey: 'caseNumber' },
    { header: 'Case Type', dataKey: 'caseType' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Date Reported', dataKey: 'dateReported' },
    { header: 'Priority', dataKey: 'priority' },
  ];

  switch (format) {
    case 'pdf':
      exportToPDF(cases, columns, { ...options, title: 'Cases Report' });
      break;
    case 'excel':
      exportToExcel(cases, columns, { ...options, title: 'Cases Report' });
      break;
    case 'csv':
      exportToCSV(cases, columns, { ...options, filename: 'cases' });
      break;
  }
}

