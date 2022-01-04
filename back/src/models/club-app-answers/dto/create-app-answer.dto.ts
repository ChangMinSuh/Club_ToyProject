import { ClubAppAnswerItems } from '../entities/club-app-answers-item.entity';
import { IsString, IsNotEmpty } from 'class-validator';
export class CreateAppAnswersBody {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  clubAppAnswerItems: ClubAppAnswerItems[];
}
