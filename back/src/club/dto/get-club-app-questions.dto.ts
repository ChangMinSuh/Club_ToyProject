import { PickType } from '@nestjs/swagger';
import { ClubAppQuestions } from 'src/entities/clubAppQuestion';

export class GetClubAppQuestionsDto extends PickType(ClubAppQuestions, [
  'id',
  'ClubId',
  'question',
  'answer_type',
  'createdAt',
  'updatedAt',
] as const) {}
