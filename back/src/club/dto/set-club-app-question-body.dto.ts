import { PickType } from '@nestjs/swagger';
import { ClubAppQuestions } from 'src/entities/clubAppQuestion';

export class SetClubAppQuestionBodyDto extends PickType(ClubAppQuestions, [
  'question',
  'answer_type',
] as const) {}
