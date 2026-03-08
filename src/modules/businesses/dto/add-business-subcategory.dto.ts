import { IsNotEmpty, IsString } from 'class-validator';

export class AddBusinessSubcategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
