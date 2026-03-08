import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

type WhatsAppProvider = 'twilio' | 'meta';

@Injectable()
export class WhatsAppService {
  constructor(private readonly configService: ConfigService) {}

  async sendMessage(to: string, body: string): Promise<{ providerMessageId?: string }> {
    const provider = this.configService.get<WhatsAppProvider>('WHATSAPP_PROVIDER', 'twilio');

    if (provider === 'meta') {
      return this.sendWithMeta(to, body);
    }

    return this.sendWithTwilio(to, body);
  }

  async sendButtons(
    to: string,
    body: string,
    buttons: Array<{ id: string; title: string }>,
  ): Promise<{ providerMessageId?: string }> {
    const provider = this.configService.get<WhatsAppProvider>('WHATSAPP_PROVIDER', 'twilio');
    if (provider === 'meta') {
      return this.sendButtonsWithMeta(to, body, buttons);
    }

    const fallbackText = `${body}\n${buttons.map((b, idx) => `${idx + 1}. ${b.title}`).join('\n')}`;
    return this.sendWithTwilio(to, fallbackText);
  }

  async sendLocation(to: string, label: string, url: string): Promise<{ providerMessageId?: string }> {
    const provider = this.configService.get<WhatsAppProvider>('WHATSAPP_PROVIDER', 'twilio');
    if (provider === 'meta') {
      return this.sendWithMeta(to, `${label}\n${url}`);
    }
    return this.sendWithTwilio(to, `${label}\n${url}`);
  }

  private async sendWithTwilio(to: string, body: string) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const from = this.configService.get<string>('TWILIO_WHATSAPP_FROM');

    if (!accountSid || !authToken || !from) {
      throw new InternalServerErrorException('Missing Twilio WhatsApp configuration');
    }

    const normalizedTo = this.normalizePhone(to);
    const normalizedFrom = this.normalizePhone(from);
    if (normalizedTo === normalizedFrom) {
      throw new BadRequestException(
        'Invalid Twilio WhatsApp destination: "To" cannot be the same as "From". Use a customer phone number.',
      );
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const payload = new URLSearchParams({
      To: this.asWhatsAppAddress(normalizedTo),
      From: this.asWhatsAppAddress(normalizedFrom),
      Body: body,
    });

    const response = await axios.post(url, payload.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: accountSid,
        password: authToken,
      },
    });

    return {
      providerMessageId: response.data?.sid,
    };
  }

  private async sendWithMeta(to: string, body: string) {
    const token = this.configService.get<string>('META_WHATSAPP_ACCESS_TOKEN');
    const phoneNumberId = this.configService.get<string>('META_WHATSAPP_PHONE_NUMBER_ID');

    if (!token || !phoneNumberId) {
      throw new InternalServerErrorException('Missing Meta WhatsApp configuration');
    }

    const normalizedTo = this.normalizePhone(to).replace('+', '');
    const url = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to: normalizedTo,
        type: 'text',
        text: {
          body,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      providerMessageId: response.data?.messages?.[0]?.id,
    };
  }

  private async sendButtonsWithMeta(
    to: string,
    body: string,
    buttons: Array<{ id: string; title: string }>,
  ) {
    const token = this.configService.get<string>('META_WHATSAPP_ACCESS_TOKEN');
    const phoneNumberId = this.configService.get<string>('META_WHATSAPP_PHONE_NUMBER_ID');

    if (!token || !phoneNumberId) {
      throw new InternalServerErrorException('Missing Meta WhatsApp configuration');
    }

    const normalizedTo = this.normalizePhone(to).replace('+', '');
    const url = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to: normalizedTo,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: { text: body },
          action: {
            buttons: buttons.slice(0, 3).map((btn) => ({
              type: 'reply',
              reply: { id: btn.id, title: btn.title.slice(0, 20) },
            })),
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      providerMessageId: response.data?.messages?.[0]?.id,
    };
  }

  normalizePhone(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) return cleaned;
    return `+${cleaned}`;
  }

  private asWhatsAppAddress(phone: string): string {
    return `whatsapp:${this.normalizePhone(phone)}`;
  }
}
