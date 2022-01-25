import { ClubAppAnswerItems } from '../entities/club-app-answers-item.entity';
import { IsString, IsNotEmpty } from 'class-validator';
export class CreateAppAnswerBody {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  clubAppAnswerItems: ClubAppAnswerItems[];
}
