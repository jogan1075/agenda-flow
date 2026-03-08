import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateOwnerBySuperAdminDto } from './dto/create-owner-by-superadmin.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('superadmin/create-owner')
  createOwner(
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: CreateOwnerBySuperAdminDto,
  ) {
    return this.authService.createOwnerBySuperAdmin(authorization, dto);
  }
}
