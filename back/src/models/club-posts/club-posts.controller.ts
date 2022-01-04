import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { ClubMember } from 'src/common/decorators/club-member.decorator';
import { ClubRoles } from 'src/common/decorators/clubs-roles.decorator';
import { ClubRolesGuard } from 'src/common/guards/club-roles.guard';
import {
  ClubMembers,
  ClubMembersRoleEnum,
} from '../club-members/entities/club-members.entity';
import { ClubPostsService } from './club-posts.service';
import { CreatePostBody } from './dto/create-post.dto';
import { UpdatePostBody } from './dto/update-post.dto';
import { ClubPosts } from './entities/club-posts.entity';

@ApiTags('club_posts')
@ClubRoles(ClubMembersRoleEnum.Manager, ClubMembersRoleEnum.User)
@UseGuards(JwtAccessGuard, ClubRolesGuard)
@Controller('clubs/:clubId/posts')
export class ClubPostsController {
  constructor(private readonly clubPostsService: ClubPostsService) {}

  @Post()
  createPost(
    @ClubMember() clubMember: ClubMembers,
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() body: CreatePostBody,
  ): Promise<void> {
    return this.clubPostsService.createPost(clubId, clubMember.id, body);
  }

  @Get()
  findAllPosts(
    @Param('clubId', ParseIntPipe) clubId: number,
  ): Promise<ClubPosts[]> {
    return this.clubPostsService.findAllPosts(clubId);
  }

  @Get(':postId')
  findOne(@Param('postId', ParseIntPipe) postId: number) {
    return this.clubPostsService.findPost(postId);
  }

  @Patch(':postId')
  updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: UpdatePostBody,
  ) {
    return this.clubPostsService.updatePost(postId, body);
  }

  @Delete(':postId')
  removePost(@Param('postId', ParseIntPipe) postId: number): Promise<void> {
    return this.clubPostsService.removePost(postId);
  }
}
