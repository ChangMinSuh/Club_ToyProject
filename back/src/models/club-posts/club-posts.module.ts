import { Module } from '@nestjs/common';
import { ClubPostsService } from './club-posts.service';
import { ClubPostsController } from './club-posts.controller';

@Module({
  controllers: [ClubPostsController],
  providers: [ClubPostsService]
})
export class ClubPostsModule {}
