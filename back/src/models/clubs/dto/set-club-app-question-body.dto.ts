import { PickType } from '@nestjs/swagger';
import { ClubAppQuestions } from 'src/models/club-app-questions/entities/club-app-questions.entity';

export class SetClubAppQuestionBodyDto extends PickType(ClubAppQuestions, [
  'question',
  'answer_type',
] as const) {}
