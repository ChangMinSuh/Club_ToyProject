import { PickType } from '@nestjs/swagger';
import { ClubAppQuestions } from 'src/models/club-app-questions/entities/club-app-questions.entity';

export class GetClubAppQuestionsDto extends PickType(ClubAppQuestions, [
  'id',
  'ClubId',
  'question',
  'answer_type',
  'createdAt',
  'updatedAt',
] as const) {}
