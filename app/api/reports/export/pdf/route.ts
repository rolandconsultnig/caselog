import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { reportData, reportType, filters } = body;

    const doc = new jsPDF();

    // Add header
    doc.setFontSize(18);
    doc.text(`SGBV Case Report: ${reportType}`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    if (reportType === 'Detailed') {
      const tableColumn = ["Case Number", "Victim", "Type", "Status", "Date"];
      const tableRows: any[] = [];

      reportData.forEach((item: any) => {
        const row = [
          item.caseNumber,
          item.victims?.[0] ? `${item.victims[0].firstName} ${item.victims[0].lastName}` : 'N/A',
          item.caseType || 'N/A',
          item.status,
          new Date(item.createdAt).toLocaleDateString(),
        ];
        tableRows.push(row);
      });

      (doc as any).autoTable({
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
