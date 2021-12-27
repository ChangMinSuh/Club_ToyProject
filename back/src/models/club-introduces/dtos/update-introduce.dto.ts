import { PickType } from '@nestjs/swagger';
import { ClubIntroduces } from '../entities/club-introduces.entity';

export class UpdateIntroduceBody extends PickType(ClubIntroduces, [
  'longExplanation',
] as const) {}
