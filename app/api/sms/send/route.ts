import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendSMS, smsTemplates } from '@/lib/sms-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { to, message, template, templateData } = body;

    if (!to || (!message && !template)) {
      return NextResponse.json(
        { error: 'Phone number and message/template required' },
        { status: 400 }
      );
    }

    let smsMessage = message;
    if (template && smsTemplates[template as keyof typeof smsTemplates]) {
      smsMessage = smsTemplates[template as keyof typeof smsTemplates](templateData);
    }

    const result = await sendSMS({ to, message: smsMessage });

    if (result) {
      return NextResponse.json({ success: true, message: 'SMS sent successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to send SMS' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    );
  }
}

