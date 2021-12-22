import { PartialType } from '@nestjs/mapped-types';
import { CreateClubPostDto } from './create-club-post.dto';

export class UpdateClubPostDto extends PartialType(CreateClubPostDto) {}
