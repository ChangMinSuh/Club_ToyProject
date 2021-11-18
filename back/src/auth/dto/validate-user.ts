import { IsString, IsNumber } from 'class-validator';

export class ValidateUserDto {
  @IsNumber()
  userId: number;

  @IsString()
  nickname: string;

  @IsString()
  email: string;
}
