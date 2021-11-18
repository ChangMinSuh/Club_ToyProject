import { OmitType } from '@nestjs/swagger';
import { Clubs } from 'src/entities/clubs';

export class SetClubDto extends OmitType(Clubs, [
  'createdAt',
  'updatedAt',
  'deletedAt',
  'id',
  'Users',
  'Owner',
] as const) {}
