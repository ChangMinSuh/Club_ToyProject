import { PickType } from '@nestjs/swagger';
import { ClubIntroduces } from '../entities/club-introduces.entity';

export class CreateIntroduceBody extends PickType(ClubIntroduces, [
  'longExplanation',
] as const) {}
