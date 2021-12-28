import { PickType } from '@nestjs/swagger';
import { ClubPosts } from '../entities/club-posts.entity';

export class UpdatePostBody extends PickType(ClubPosts, [
  'title',
  'content',
] as const) {}
