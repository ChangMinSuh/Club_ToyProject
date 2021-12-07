import { PickType } from '@nestjs/swagger';
import { Clubs } from 'src/entities/clubs';

export class SetClubBodyDto extends PickType(Clubs, [
  'name',
  'explanation',
] as const) {}
