import { PartialType } from '@nestjs/mapped-types';
import { CreateClubIntroduceDto } from './create-club-introduce.dto';

export class UpdateClubIntroduceDto extends PartialType(CreateClubIntroduceDto) {}
