import { PickType } from '@nestjs/swagger';
import { ClubAppAnswers } from '../entities/club-app-answers.entity';
export class UpdateAppAnswerStatusBody extends PickType(ClubAppAnswers, [
  'status',
] as const) {}
