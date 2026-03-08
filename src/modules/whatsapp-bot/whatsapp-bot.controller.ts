import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InboundProvider } from './whatsapp-bot.types';
import { WhatsAppBotService } from './whatsapp-bot.service';

@Controller('whatsapp-bot')
export class WhatsAppBotController {
  constructor(private readonly whatsappBotService: WhatsAppBotService) {}

  @Get('webhook/meta')
  verifyMetaWebhook(
    @Query('hub.mode') mode?: string,
    @Query('hub.verify_token') verifyToken?: string,
    @Query('hub.challenge') challenge?: string,
  ) {
    if (mode === 'subscribe' && verifyToken === process.env.META_WEBHOOK_VERIFY_TOKEN) {
      return challenge ?? '';
    }

    return 'verification_failed';
  }

  @Post('webhook/:provider/:businessId')
  async handleWebhook(
    @Param('provider') provider: InboundProvider,
    @Param('businessId') businessId: string,
    @Body() payload: unknown,
  ) {
    const inbound = this.parseInboundMessage(provider, payload);
    if (!inbound) {
      return { ok: true, ignored: true };
    }

    return this.whatsappBotService.handleIncomingMessage(businessId, inbound);
  }

  @Post('webhook/:provider')
  async handleWebhookWithQueryBusinessId(
    @Param('provider') provider: InboundProvider,
    @Query('businessId') businessId: string,
    @Body() payload: unknown,
  ) {
    if (!businessId) {
      throw new BadRequestException(
        'Missing businessId. Use /webhook/:provider/:businessId or /webhook/:provider?businessId=...',
      );
    }

    const inbound = this.parseInboundMessage(provider, payload);
    if (!inbound) {
      return { ok: true, ignored: true };
    }

    return this.whatsappBotService.handleIncomingMessage(businessId, inbound);
  }

  @Post('send-location/:businessId')
  sendLocation(
    @Param('businessId') businessId: string,
    @Query('to') to: string,
  ) {
    return this.whatsappBotService.sendLocationMessage(businessId, to);
  }

  private parseInboundMessage(provider: InboundProvider, payload: unknown) {
    if (provider === 'twilio') {
      const body = payload as Record<string, unknown>;
      const text = String(body.Body ?? '');
      const phone = String(body.From ?? '').replace('whatsapp:', '');

      if (!phone) return null;
      return { phone, text };
    }

    const root = payload as {
      entry?: Array<{
        changes?: Array<{
          value?: {
            messages?: Array<{
              from?: string;
              text?: { body?: string };
              interactive?: { button_reply?: { id?: string; title?: string } };
            }>;
          };
        }>;
      }>;
    };

    const message = root.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const phone = message?.from;
    if (!phone) return null;

    return {
      phone: `+${phone}`,
      text: message?.text?.body ?? message?.interactive?.button_reply?.title ?? '',
      buttonId: message?.interactive?.button_reply?.id,
    };
  }
}
