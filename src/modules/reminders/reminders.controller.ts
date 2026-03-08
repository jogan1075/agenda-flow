import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { RemindersService } from './reminders.service';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(@Body() dto: CreateReminderDto) {
    return this.remindersService.create(dto);
  }

  @Get('pending')
  listPending(@Query('until') until?: string) {
    return this.remindersService.listPending(until);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReminderDto) {
    return this.remindersService.update(id, dto);
  }

  @Post('process-now')
  processNow(@Query('limit') limit?: string) {
    const parsedLimit = Number(limit ?? 50);
    return this.remindersService.processPendingWhatsAppReminders(
      Number.isNaN(parsedLimit) ? 50 : parsedLimit,
    );
  }
}
