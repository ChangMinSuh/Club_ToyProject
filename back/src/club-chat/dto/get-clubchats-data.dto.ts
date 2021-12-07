import { PickType } from '@nestjs/swagger';
import { ClubChats } from 'src/entities/clubChats';
import { Users } from 'src/entities/users';

export class GetClubChatsDataDto extends PickType(ClubChats, [
  'id',
  'content',
  'createAt',
  'UserId',
] as const) {
  User?: Users;
}
