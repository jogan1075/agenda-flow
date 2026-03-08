import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByBusinessAndEmail(dto.businessId, dto.email);
    if (existingUser) {
      throw new ConflictException('User already exists for this business');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      businessId: dto.businessId,
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      passwordHash,
      role: dto.role,
    });

    return this.signToken({
      sub: user.id,
      businessId: user.businessId,
      role: user.role,
      email: user.email,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByBusinessAndEmail(dto.businessId, dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken({
      sub: user.id,
      businessId: user.businessId,
      role: user.role,
      email: user.email,
    });
  }

  private signToken(payload: Record<string, string>) {
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      tokenType: 'Bearer',
      user: {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        businessId: payload.businessId,
      },
    };
  }
}
