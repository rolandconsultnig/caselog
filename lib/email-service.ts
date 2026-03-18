import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailTemplate<TData = unknown> {
  subject: string;
  html: (data: TData) => string;
  text?: (data: TData) => string;
}

export type TypedEmailTemplate<TData> = EmailTemplate<TData>;

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    // Only create transporter if credentials are provided
    if (emailConfig.auth.user && emailConfig.auth.pass) {
      this.transporter = nodemailer.createTransport(emailConfig);
    } else {
      console.warn('Email service not configured. SMTP credentials missing.');
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.warn('Email service not available. Email would have been sent:', options);
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendTemplateEmail<TData>(
    template: EmailTemplate<TData>,
    data: TData,
    to: string | string[]
  ): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: template.subject,
      html: template.html(data),
      text: template.text ? template.text(data) : undefined,
    });
  }

  async sendTypedTemplateEmail<TData>(
    template: TypedEmailTemplate<TData>,
    data: TData,
    to: string | string[]
  ): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: template.subject,
      html: template.html(data),
      text: template.text ? template.text(data) : undefined,
    });
  }
}

// Email Templates
export const emailTemplates = {
  caseCreated: {
    subject: 'New Case Created - {{caseNumber}}',
    html: (data: { caseNumber: string; caseType: string; userName: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">New Case Created</h2>
        <p>Dear ${data.userName},</p>
        <p>A new case has been created in the SGBV Information System:</p>
        <ul>
          <li><strong>Case Number:</strong> ${data.caseNumber}</li>
          <li><strong>Case Type:</strong> ${data.caseType}</li>
        </ul>
        <p>Please log in to the system to view case details.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated message from the Sexual and Gender-Based Violence Information System.
        </p>
      </div>
    `,
  },

  caseAssigned: {
    subject: 'Case Assigned to You - {{caseNumber}}',
    html: (data: { caseNumber: string; caseType: string; assignedBy: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Case Assigned</h2>
        <p>You have been assigned a new case:</p>
        <ul>
          <li><strong>Case Number:</strong> ${data.caseNumber}</li>
          <li><strong>Case Type:</strong> ${data.caseType}</li>
          <li><strong>Assigned By:</strong> ${data.assignedBy}</li>
        </ul>
        <p>Please log in to review and begin working on this case.</p>
      </div>
    `,
  },

  caseStatusChanged: {
    subject: 'Case Status Updated - {{caseNumber}}',
    html: (data: { caseNumber: string; oldStatus: string; newStatus: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Case Status Updated</h2>
        <p>The status of case <strong>${data.caseNumber}</strong> has been updated:</p>
        <p><strong>Previous Status:</strong> ${data.oldStatus}</p>
        <p><strong>New Status:</strong> ${data.newStatus}</p>
        <p>Please log in to view updated case details.</p>
      </div>
    `,
  },

  documentUploaded: {
    subject: 'Document Uploaded to Case - {{caseNumber}}',
    html: (data: { caseNumber: string; fileName: string; uploadedBy: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">Document Uploaded</h2>
        <p>A new document has been uploaded to case <strong>${data.caseNumber}</strong>:</p>
        <ul>
          <li><strong>File Name:</strong> ${data.fileName}</li>
          <li><strong>Uploaded By:</strong> ${data.uploadedBy}</li>
        </ul>
        <p>Please log in to view the document.</p>
      </div>
    `,
  },

  passwordReset: {
    subject: 'Password Reset Request',
    html: (data: { userName: string; resetLink: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Password Reset Request</h2>
        <p>Dear ${data.userName},</p>
        <p>You have requested to reset your password. Click the link below to proceed:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in 1 hour.</p>
        <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  },

  notification: {
    subject: '{{subject}}',
    html: (data: { subject: string; message: string; userName: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">${data.subject}</h2>
        <p>Dear ${data.userName},</p>
        <p>${data.message}</p>
      </div>
    `,
  },
};

// Singleton instance
export const emailService = new EmailService();

