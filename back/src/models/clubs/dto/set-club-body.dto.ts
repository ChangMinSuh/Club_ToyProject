import { PickType } from '@nestjs/swagger';
import { Clubs } from 'src/models/clubs/entities/clubs.entity';

export class SetClubBodyDto extends PickType(Clubs, [
  'name',
  'explanation',
] as const) {}
