import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AiAssistantService {
  constructor(private readonly configService: ConfigService) {}

  async suggestReply(input: {
    businessName: string;
    userMessage: string;
    contextSummary: string;
  }): Promise<string | null> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      return null;
    }

    const prompt = [
      'Eres un asistente de reservas por WhatsApp para un negocio.',
      'Responde en espanol, breve y accionable, sin inventar horarios.',
      `Negocio: ${input.businessName}`,
      `Contexto: ${input.contextSummary}`,
      `Mensaje cliente: ${input.userMessage}`,
    ].join('\n');

    const response = await axios.post(
      'https://api.openai.com/v1/responses',
      {
        model: 'gpt-4.1-mini',
        input: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const text = response.data?.output_text;
    if (typeof text === 'string' && text.trim().length > 0) {
      return text.trim();
    }

    return null;
  }
}
