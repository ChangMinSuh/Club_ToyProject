import { PickType } from '@nestjs/swagger';
import { Users } from 'src/models/users/entities/users.entity';
import { ClubChats } from '../entities/club-chats';

export class GetClubChatsDataDto extends PickType(ClubChats, [
  'id',
  'content',
  'createAt',
  'UserId',
] as const) {
  User?: Users;
}
