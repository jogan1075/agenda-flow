import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RemindersService } from './reminders.service';

@Injectable()
export class RemindersScheduler {
  private readonly logger = new Logger(RemindersScheduler.name);

  constructor(private readonly remindersService: RemindersService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async processDueWhatsAppReminders() {
    const result = await this.remindersService.processPendingWhatsAppReminders(50);

    if (result.processed > 0 || result.failed > 0) {
      this.logger.log(
        `Processed reminders: processed=${result.processed} sent=${result.sent} failed=${result.failed}`,
      );
    }
  }
}
