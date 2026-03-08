import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';

@Injectable()
export class SuperAdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(SuperAdminSeedService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    const email = this.configService.get<string>('SUPERADMIN_EMAIL');
    const password = this.configService.get<string>('SUPERADMIN_PASSWORD');
    const fullName = this.configService.get<string>('SUPERADMIN_NAME') ?? 'Super Admin';

    if (!email || !password) {
      return;
    }

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.usersService.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      role: 'super_admin',
    });

    this.logger.log(`Super admin creado automaticamente para ${email}`);
  }
}
