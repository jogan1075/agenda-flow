export type BotIntent =
  | 'book'
  | 'availability'
  | 'cancel'
  | 'reschedule'
  | 'location'
  | 'help'
  | 'unknown';

export type InboundProvider = 'twilio' | 'meta';

export type InboundMessage = {
  phone: string;
  text: string;
  buttonId?: string;
};
