import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MercadoPagoService {
  async createPreference(accessToken: string, payload: Record<string, unknown>) {
    const response = await axios.post('https://api.mercadopago.com/checkout/preferences', payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data as {
      id: string;
      init_point: string;
      sandbox_init_point?: string;
    };
  }

  async getPayment(accessToken: string, paymentId: string) {
    const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data as Record<string, unknown>;
  }
}
