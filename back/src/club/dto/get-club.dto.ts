import { PickType } from '@nestjs/swagger';
import { Clubs } from 'src/entities/clubs';

export class GetClubDto extends PickType(Clubs, [
  'id',
  'name',
  'explanation',
  'createdAt',
  'updatedAt',
  'Owner',
] as const) {}
