import { PickType } from '@nestjs/swagger';
import { Clubs } from 'src/models/clubs/entities/clubs.entity';

export class GetClubDto extends PickType(Clubs, [
  'id',
  'name',
  'explanation',
  'createdAt',
  'updatedAt',
  'Owner',
] as const) {}
