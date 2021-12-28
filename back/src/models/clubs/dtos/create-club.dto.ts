import { PickType } from '@nestjs/swagger';
import { Clubs } from '../entities/clubs.entity';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateClubBody extends PickType(Clubs, [
  'name',
  'explanation',
] as const) {
  @IsNotEmpty()
  @IsString()
  nickname: string;
}
