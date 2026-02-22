import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class MailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: parseInt(process.env.SMTP_PORT || "1025"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  static async sendMail(options: SendMailOptions) {
    // If SMTP credentials are not fully provided, we will just log the email for development
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`[DEV] Email suppressed. Would have sent to ${options.to}`);
      console.log(`[DEV] Subject: ${options.subject}`);
      console.log(`[DEV] Text: ${options.text}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Farmer Profitability App" <noreply@example.com>',
        ...options,
      });
      console.log(`Email sent to ${options.to}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }

  static async sendOtpEmail(to: string, otp: string) {
    const subject = "Your Verification Code";
    const text = `Your One-Time Password (OTP) for registration is: ${otp}. It will expire in 10 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verify your email address</h2>
        <p>Your One-Time Password (OTP) for registration is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await this.sendMail({ to, subject, text, html });
  }
}
