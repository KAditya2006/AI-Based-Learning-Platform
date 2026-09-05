import * as nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

class EmailService {
  private transporter!: nodemailer.Transporter;

  constructor() {}

  async init() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'marjory.hessel@ethereal.email',
        pass: process.env.SMTP_PASS || 'dE52jM4jM3gP144Wc2',
      },
    });

    try {
      await this.transporter.verify();
      logger.info('SMTP Connection established successfully');
    } catch (error: any) {
      logger.error('SMTP Connection failed:', error.message);
      // We don't throw to prevent crashing the server, but log it
    }
  }

  async sendVerificationEmail(to: string, otp: string) {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Statistix Intelligence" <noreply@statistix.gov.in>',
      to,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50; text-align: center;">Welcome to Statistix Intelligence Platform</h2>
          <p style="color: #4a5568; font-size: 16px;">Please use the following 6-digit verification code to complete your registration. This code will expire in 15 minutes.</p>
          <div style="background-color: #f7fafc; border-radius: 4px; padding: 16px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2b6cb0;">${otp}</span>
          </div>
          <p style="color: #718096; font-size: 14px; text-align: center;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      
      const testUrl = nodemailer.getTestMessageUrl(info);
      if (testUrl) {
        logger.info(`Preview URL: ${testUrl}`);
      }
      
      return {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
      };
    } catch (error: any) {
      logger.error(`Failed to send email to ${to}:`, error.message);
      throw new Error('Failed to send verification email. Please try again later.');
    }
  }
}

export const emailService = new EmailService();
