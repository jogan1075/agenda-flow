import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BusinessesService } from '../businesses/businesses.service';
import { UsersService } from '../users/users.service';
import { CreateOwnerBySuperAdminDto } from './dto/create-owner-by-superadmin.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly businessesService: BusinessesService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
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
    const user = dto.businessId
      ? await this.usersService.findByBusinessAndEmail(dto.businessId, dto.email)
      : await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role !== 'super_admin' && user.businessId) {
      const business = await this.businessesService.findById(user.businessId);
      if (!business || business.isEnabled === false) {
        throw new UnauthorizedException('Negocio deshabilitado por estado de suscripcion');
      }
    }

    return this.signToken({
      sub: user.id,
      businessId: user.businessId ?? '',
      role: user.role,
      email: user.email,
    });
  }

  async createOwnerBySuperAdmin(authorizationHeader: string | undefined, dto: CreateOwnerBySuperAdminDto) {
    const token = authorizationHeader?.startsWith('Bearer ')
      ? authorizationHeader.replace('Bearer ', '').trim()
      : '';

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const payload = this.jwtService.verify<{ role?: string }>(token);
    if (payload.role !== 'super_admin') {
      throw new UnauthorizedException('Only super admin can create owner users');
    }

    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = await this.usersService.create({
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      passwordHash,
      role: 'owner',
    });

    return {
      id: created.id,
      email: created.email,
      role: created.role,
      businessId: created.businessId ?? '',
    };
  }

  private signToken(payload: { sub: string; role: string; email: string; businessId?: string }) {
    const normalizedPayload = {
      ...payload,
      businessId: payload.businessId ?? '',
    };
    const accessToken = this.jwtService.sign(normalizedPayload);
    return {
      accessToken,
      tokenType: 'Bearer',
      user: {
        id: normalizedPayload.sub,
        email: normalizedPayload.email,
        role: normalizedPayload.role,
        businessId: normalizedPayload.businessId,
      },
    };
  }
}
