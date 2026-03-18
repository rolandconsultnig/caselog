import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type DetailedReportItem = {
  caseNumber?: string;
  victims?: Array<{ firstName?: string; lastName?: string }>;
  caseType?: string | null;
  status?: string;
  createdAt?: string | Date;
};

type PdfExportBody = {
  reportData?: unknown;
  reportType?: unknown;
  filters?: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = (await request.json()) as PdfExportBody;
    const reportType = typeof body.reportType === 'string' ? body.reportType : '';
    const reportData: DetailedReportItem[] = Array.isArray(body.reportData)
      ? (body.reportData as DetailedReportItem[])
      : [];

    const doc = new jsPDF();

    // Add header
    doc.setFontSize(18);
    doc.text(`SGBV Case Report: ${reportType}`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    if (reportType === 'Detailed') {
      const tableColumn = ["Case Number", "Victim", "Type", "Status", "Date"];
      const tableRows: Array<[string, string, string, string, string]> = [];

      reportData.forEach((item) => {
        const createdAt = item.createdAt ? new Date(item.createdAt) : null;
        const victim = item.victims?.[0]
          ? `${item.victims[0].firstName ?? ''} ${item.victims[0].lastName ?? ''}`.trim()
          : 'N/A';

        const row: [string, string, string, string, string] = [
          item.caseNumber ?? 'N/A',
          victim || 'N/A',
          item.caseType || 'N/A',
          item.status ?? 'N/A',
          createdAt ? createdAt.toLocaleDateString() : 'N/A',
        ];
        tableRows.push(row);
      });

      (doc as unknown as { autoTable: (options: unknown) => void }).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
      });
    } else {
      // Handle other report types later
      doc.text("Summary and other report types are not yet implemented for PDF export.", 14, 40);
    }
    
    const pdfBuffer = doc.output('arraybuffer');

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="report.pdf"',
      },
    });

  } catch (error) {
    console.error('Error generating PDF report:', error);
    return new Response('Failed to generate PDF report', { status: 500 });
  }
}
