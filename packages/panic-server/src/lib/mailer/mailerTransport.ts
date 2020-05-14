import * as nodemailer from 'nodemailer';
export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class MailerTransport {
  transporter: any;
  constructor(config: any) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(mailOptions: MailOptions) {
    await this.transporter.sendMail(mailOptions);
  }
}
