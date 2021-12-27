import { PickType } from '@nestjs/swagger';
import { Clubs } from '../entities/clubs.entity';

export class CreateClubBody extends PickType(Clubs, [
  'name',
  'explanation',
] as const) {}
