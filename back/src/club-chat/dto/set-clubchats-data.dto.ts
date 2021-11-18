import { PickType } from '@nestjs/swagger';
import { ClubChats } from 'src/entities/clubChats';

export class SetClubChatsDataDto extends PickType(ClubChats, [
  'content',
  'ClubId',
]) {
  clubName: string;
}
