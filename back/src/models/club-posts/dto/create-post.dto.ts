import { PickType } from '@nestjs/swagger';
import { ClubPosts } from '../entities/club-posts.entity';

export class CreatePostBody extends PickType(ClubPosts, [
  'title',
  'content',
  'showStatus',
] as const) {}
