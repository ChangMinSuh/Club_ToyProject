import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class CookieTokenDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsString()
  domain: string;

  @ApiProperty()
  @IsBoolean()
  httpOnly: boolean;

  @ApiProperty()
  @IsString()
  path: string;
}
