import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';
import { PublicBookingsModule } from './modules/public-bookings/public-bookings.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ServicesModule } from './modules/services/services.module';
import { UsersModule } from './modules/users/users.module';
import { WhatsAppBotModule } from './modules/whatsapp-bot/whatsapp-bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb+srv://summon1075_db_user:OMNja5LUXXNfYGPc@cluster0.spcwbal.mongodb.net/'),
      }),
    }),
    AuthModule,
    UsersModule,
    BusinessesModule,
    ServicesModule,
    ProfessionalsModule,
    PublicBookingsModule,
    CustomersModule,
    AppointmentsModule,
    RemindersModule,
    ReportsModule,
    WhatsAppBotModule,
  ],
})
export class AppModule {}
