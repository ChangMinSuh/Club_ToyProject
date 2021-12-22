import { PickType } from '@nestjs/swagger';
import { ClubChats } from '../entities/club-chats';

export class SetClubChatsDataDto extends PickType(ClubChats, [
  'content',
  'ClubId',
]) {
  clubName: string;
}
