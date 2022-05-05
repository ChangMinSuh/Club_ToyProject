import { PickType } from '@nestjs/swagger';
import { ClubChats } from '../entities/club-chats.entity';

export class SetClubChatsDataDto extends PickType(ClubChats, [
  'content',
  'ClubMember',
  'ClubChatRoomId',
  'isNotice',
]) {}
