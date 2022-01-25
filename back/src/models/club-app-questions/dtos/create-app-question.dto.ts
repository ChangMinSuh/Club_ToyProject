import { PickType } from '@nestjs/swagger';
import { ClubAppQuestions } from '../entities/club-app-questions.entity';

export class CreateAppQuestionBody extends PickType(ClubAppQuestions, [
  'question',
  'answer_type',
] as const) {}
