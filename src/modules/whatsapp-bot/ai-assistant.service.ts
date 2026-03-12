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
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
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

    const model = this.configService.get<string>('GEMINI_MODEL', 'gemini-2.5-flash');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    try {
      const response = await axios.post(
        url,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            'x-goog-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof text === 'string' && text.trim().length > 0) {
        return text.trim();
      }
    } catch {
      return null;
    }

    return null;
  }
}
