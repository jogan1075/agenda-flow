import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateOwnerBySuperAdminDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
