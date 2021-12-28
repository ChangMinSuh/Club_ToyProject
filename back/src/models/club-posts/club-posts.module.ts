import { Module } from '@nestjs/common';
import { ClubPostsService } from './club-posts.service';
import { ClubPostsController } from './club-posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubPosts } from './entities/club-posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClubPosts])],
  controllers: [ClubPostsController],
  providers: [ClubPostsService],
})
export class ClubPostsModule {}
