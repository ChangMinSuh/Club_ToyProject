import { PartialType } from '@nestjs/mapped-types';
import { CreateClubAppQuestionDto } from './create-club-app-question.dto';

export class UpdateClubAppQuestionDto extends PartialType(
  CreateClubAppQuestionDto,
) {}
