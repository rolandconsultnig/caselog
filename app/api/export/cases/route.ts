import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getPermissions, canAccessCase } from '@/lib/permissions';
import { Prisma, TenantType } from '@prisma/client';
import jsPDF from 'jspdf';
import autoTable, { type UserOptions } from 'jspdf-autotable';
import * as XLSX from 'xlsx';

type ExportSingleCasePayload = Prisma.CaseGetPayload<{
  include: {
    victims: true;
    perpetrators: true;
    evidence: true;
    witnesses: true;
  };
}>;

type ExportMultiCasePayload = Prisma.CaseGetPayload<{
  include: {
    victims: { take: 1 };
    perpetrators: { take: 1 };
  };
}>;

type CsvCell = string | number | boolean | null | undefined;

type JsPdfWithLastAutoTable = {
  lastAutoTable?: {
    finalY?: number;
  };
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = getPermissions(
      session.user.accessLevel,
      session.user.tenantType as TenantType
    );

    if (!permissions.canExportData) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'pdf';
    const caseId = searchParams.get('caseId');
    const tenantId = searchParams.get('tenantId');

    if (caseId) {
      // Export single case
      const caseData = await prisma.case.findUnique({
        where: { id: caseId },
        include: {
          victims: true,
          perpetrators: true,
          evidence: { take: 10 },
          witnesses: { take: 10 },
        },
      });

      if (!caseData) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      }

      if (
        !canAccessCase(
          session.user.tenantId,
          caseData.tenantId,
          session.user.tenantType as TenantType
        )
      ) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      if (format === 'pdf') {
        return exportCasePDF(caseData);
      } else if (format === 'excel') {
        return exportCaseExcel(caseData);
      } else if (format === 'csv') {
        return exportCaseCSV(caseData);
      }
    } else {
      // Export multiple cases
      const where: Prisma.CaseWhereInput = {};

      if (session.user.tenantType !== 'FEDERAL') {
        where.tenantId = session.user.tenantId;
      } else if (tenantId) {
        where.tenantId = tenantId;
      }

      const cases = await prisma.case.findMany({
        where,
        include: {
          victims: { take: 1 },
          perpetrators: { take: 1 },
        },
        take: 1000, // Limit for performance
      });

      if (format === 'pdf') {
        return exportCasesPDF(cases);
      } else if (format === 'excel') {
        return exportCasesExcel(cases);
      } else if (format === 'csv') {
        return exportCasesCSV(cases);
      }
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    console.error('Error exporting cases:', error);
    return NextResponse.json(
      { error: 'Failed to export cases' },
      { status: 500 }
    );
  }
}

function exportCasePDF(caseData: ExportSingleCasePayload) {
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
    ['Case Number', caseData.caseNumber || 'N/A'],
    ['Case Type', caseData.caseType || 'N/A'],
    ['Status', caseData.status || 'N/A'],
    ['Date Reported', caseData.createdAt ? new Date(caseData.createdAt).toLocaleDateString() : 'N/A'],
    ['Priority', caseData.priority || 'N/A'],
  ];

  autoTable(doc, {
    body: caseInfo,
    startY: yPos,
    theme: 'grid',
    styles: { fontSize: 9 },
  } as UserOptions);

  yPos = (((doc as unknown as JsPdfWithLastAutoTable).lastAutoTable?.finalY ?? yPos) + 15);

  // Victims
  if (caseData.victims.length > 0) {
    doc.setFontSize(14);
    doc.text('Victims', 14, yPos);
    yPos += 10;

    const victimData = caseData.victims.map((v) => [
      v.firstName || '',
      v.lastName || '',
      v.age?.toString() || '',
      v.gender || '',
    ]);

    autoTable(doc, {
      head: [['Name', 'Age', 'Gender']],
      body: victimData,
      startY: yPos,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 163, 74] },
    } as UserOptions);

    yPos = (((doc as unknown as JsPdfWithLastAutoTable).lastAutoTable?.finalY ?? yPos) + 15);
  }

  // Perpetrators
  if (caseData.perpetrators.length > 0) {
    doc.setFontSize(14);
    doc.text('Perpetrators', 14, yPos);
    yPos += 10;

    const perpetratorData = caseData.perpetrators.map((p) => [
      (p.firstName || p.lastName) ? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() : '',
      p.age?.toString() || '',
      p.gender || '',
    ]);

    autoTable(doc, {
      head: [['Name', 'Age', 'Gender']],
      body: perpetratorData,
      startY: yPos,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 163, 74] },
    } as UserOptions);
  }

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="case-${caseData.caseNumber || 'report'}-${new Date().toISOString().split('T')[0]}.pdf"`,
    },
  });
}

function exportCaseExcel(caseData: ExportSingleCasePayload) {
  const wb = XLSX.utils.book_new();

  // Case Information Sheet
  const caseInfo = [
    ['Case Number', caseData.caseNumber || 'N/A'],
    ['Case Type', caseData.caseType || 'N/A'],
    ['Status', caseData.status || 'N/A'],
    ['Date Reported', (caseData.reportedDate ?? caseData.createdAt) ? new Date(caseData.reportedDate ?? caseData.createdAt).toLocaleDateString() : 'N/A'],
    ['Priority', caseData.priority || 'N/A'],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet([['Case Information'], ...caseInfo]);
  XLSX.utils.book_append_sheet(wb, ws1, 'Case Info');

  // Victims Sheet
  if (caseData.victims && caseData.victims.length > 0) {
    const victimData = [
      ['First Name', 'Last Name', 'Age', 'Gender'],
      ...caseData.victims.map((v) => [
        v.firstName || '',
        v.lastName || '',
        v.age || '',
        v.gender || '',
      ]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(victimData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Victims');
  }

  // Perpetrators Sheet
  if (caseData.perpetrators.length > 0) {
    const perpetratorData = [
      ['Name', 'Age', 'Gender'],
      ...caseData.perpetrators.map((p) => [
        (p.firstName || p.lastName) ? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() : '',
        p.age || '',
        p.gender || '',
      ]),
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(perpetratorData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Perpetrators');
  }

  const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(excelBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="case-${caseData.caseNumber || 'report'}-${new Date().toISOString().split('T')[0]}.xlsx"`,
    },
  });
}

function exportCaseCSV(caseData: ExportSingleCasePayload) {
  const rows = [
    ['Case Number', caseData.caseNumber || 'N/A'],
    ['Case Type', caseData.caseType || 'N/A'],
    ['Status', caseData.status || 'N/A'],
    ['Date Reported', caseData.createdAt ? new Date(caseData.createdAt).toLocaleDateString() : 'N/A'],
    ['Priority', caseData.priority || 'N/A'],
    [],
    ['Victims'],
    ['First Name', 'Last Name', 'Age', 'Gender'],
    ...caseData.victims.map((v) => [
      v.firstName || '',
      v.lastName || '',
      v.age || '',
      v.gender || '',
    ]),
    [],
    ['Perpetrators'],
    ['Name', 'Age', 'Gender'],
    ...caseData.perpetrators.map((p) => [
      (p.firstName || p.lastName) ? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() : '',
      p.age || '',
      p.gender || '',
    ]),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((cell: CsvCell) => `"${cell ?? ''}"`)
        .join(',')
    )
    .join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="case-${caseData.caseNumber || 'report'}-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}

function exportCasesPDF(cases: ExportMultiCasePayload[]) {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Cases Report', 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Total Cases: ${cases.length}`, 14, 36);

  const caseData = cases.map((c) => [
    c.caseNumber || 'N/A',
    c.caseType || 'N/A',
    c.status || 'N/A',
    c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A',
    c.priority || 'N/A',
  ]);

  autoTable(doc, {
    head: [['Case Number', 'Case Type', 'Status', 'Date Reported', 'Priority']],
    body: caseData,
    startY: 45,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 163, 74] },
  } as UserOptions);

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="cases-report-${new Date().toISOString().split('T')[0]}.pdf"`,
    },
  });
}

function exportCasesExcel(cases: ExportMultiCasePayload[]) {
  const caseData = [
    ['Case Number', 'Case Type', 'Status', 'Date Reported', 'Priority'],
    ...cases.map((c) => [
      c.caseNumber || 'N/A',
      c.caseType || 'N/A',
      c.status || 'N/A',
      c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A',
      c.priority || 'N/A',
    ]),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(caseData);
  XLSX.utils.book_append_sheet(wb, ws, 'Cases');

  const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(excelBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="cases-report-${new Date().toISOString().split('T')[0]}.xlsx"`,
    },
  });
}

function exportCasesCSV(cases: ExportMultiCasePayload[]) {
  const rows = [
    ['Case Number', 'Case Type', 'Status', 'Date Reported', 'Priority'],
    ...cases.map((c) => [
      c.caseNumber || 'N/A',
      c.caseType || 'N/A',
      c.status || 'N/A',
      c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A',
      c.priority || 'N/A',
    ]),
  ];

  const csv = rows
    .map((row) => row.map((cell: CsvCell) => `"${cell ?? ''}"`).join(','))
    .join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="cases-report-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}

