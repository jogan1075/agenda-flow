import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendBookingConfirmation(input: {
    to: string;
    customerName: string;
    businessName: string;
    serviceName: string;
    professionalName: string;
    date: string;
    time: string;
  }) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') ?? 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const from = this.configService.get<string>('SMTP_FROM') ?? user;
    const secure = this.configService.get<string>('SMTP_SECURE') === 'true' || port === 465;
    const requireTls = this.configService.get<string>('SMTP_REQUIRE_TLS') === 'true';
    const rejectUnauthorized = this.configService.get<string>('SMTP_TLS_REJECT_UNAUTHORIZED') !== 'false';

    if (!host || !user || !pass || !from) {
      return { sent: false, reason: 'SMTP not configured' };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS: requireTls,
      auth: { user, pass },
      tls: {
        rejectUnauthorized,
      },
    });

    const subject = `Confirmacion de reserva - ${input.businessName}`;
    const text = `Hola ${input.customerName}, tu reserva fue confirmada.\n\nServicio: ${input.serviceName}\nProfesional: ${input.professionalName}\nFecha: ${input.date}\nHora: ${input.time}\n\nGracias por reservar en ${input.businessName}.`;

    try {
      await transporter.sendMail({
        from,
        to: input.to,
        subject,
        text,
      });
    } catch (error) {
      const err = error as { message?: string; code?: string; responseCode?: number };
      return {
        sent: false,
        reason: `smtp_error:${err.code ?? 'unknown'}:${err.responseCode ?? 'na'}:${err.message ?? 'unknown'}`,
      };
    }

    return { sent: true, reason: 'sent' };
  }
}
