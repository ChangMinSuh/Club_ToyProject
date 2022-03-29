import { PickType } from '@nestjs/swagger';
import { Users } from 'src/models/users/entities/users.entity';
import { ClubChats } from '../entities/club-chats.entity';

export class GetClubChatsDataDto extends PickType(ClubChats, [
  'id',
  'content',
  'createdAt',
  'ClubMemberId',
] as const) {
  User?: Users;
}
