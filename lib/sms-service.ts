import twilio from 'twilio';

interface SMSOptions {
  to: string;
  message: string;
  from?: string;
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send SMS notification
 */
export async function sendSMS(options: SMSOptions): Promise<boolean> {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('SMS service not configured. Skipping SMS sending.');
    console.log(`Simulating SMS to ${options.to}: ${options.message}`);
    return false;
  }

  try {
    await client.messages.create({
      body: options.message,
      from: process.env.TWILIO_PHONE_NUMBER || options.from || '+1234567890',
      to: options.to,
    });

    console.log(`SMS sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error(`Failed to send SMS to ${options.to}:`, error);
    return false;
  }
}

/**
 * Send bulk SMS notifications
 */
export async function sendBulkSMS(
  recipients: string[],
  message: string
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const result = await sendSMS({ to: recipient, message });
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
}

/**
 * SMS Templates
 */
export const smsTemplates = {
  caseCreated: (data: { caseNumber: string; victimName: string }) =>
    `New SGBV case ${data.caseNumber} has been created for ${data.victimName}. Please log in to view details.`,

  caseAssigned: (data: { caseNumber: string; assigneeName: string }) =>
    `Case ${data.caseNumber} has been assigned to you. Please review and take action.`,

  caseStatusChanged: (data: { caseNumber: string; oldStatus: string; newStatus: string }) =>
    `Case ${data.caseNumber} status updated from ${data.oldStatus} to ${data.newStatus}.`,

  appointmentReminder: (data: { caseNumber: string; appointmentDate: string; serviceType: string }) =>
    `Reminder: You have an appointment for case ${data.caseNumber} on ${data.appointmentDate} for ${data.serviceType}.`,

  passwordReset: (data: { resetCode: string }) =>
    `Your password reset code is ${data.resetCode}. This code expires in 10 minutes.`,

  emergencyAlert: (data: { caseNumber: string; location: string }) =>
    `EMERGENCY ALERT: Case ${data.caseNumber} requires immediate attention at ${data.location}.`,

  courtHearing: (data: { caseNumber: string; hearingDate: string; courtLocation: string }) =>
    `Court hearing scheduled for case ${data.caseNumber} on ${data.hearingDate} at ${data.courtLocation}.`,

  evidenceCollected: (data: { caseNumber: string; evidenceNumber: string }) =>
    `Evidence ${data.evidenceNumber} has been collected for case ${data.caseNumber}.`,

  verdictReached: (data: { caseNumber: string; verdict: string }) =>
    `Verdict reached for case ${data.caseNumber}: ${data.verdict}. Please log in for details.`,
};

