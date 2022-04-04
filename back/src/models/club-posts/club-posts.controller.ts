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
  UseInterceptors,
  UploadedFiles,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { Express } from 'express';
import { ConfigService } from '@nestjs/config';
import { basename, extname } from 'path';
import { mkdirSync, readdirSync } from 'fs';
import { diskStorage } from 'multer';
if (process.env.NODE_ENV !== 'production') {
  try {
    readdirSync('uploads/club-posts');
  } catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    mkdirSync('uploads/club-posts');
  }
}

@ApiTags('club_posts')
@ClubRoles(ClubMembersRoleEnum.Manager, ClubMembersRoleEnum.User)
@UseGuards(JwtAccessGuard, ClubRolesGuard)
@Controller('clubs/:clubId/posts')
export class ClubPostsController {
  constructor(
    private readonly clubPostsService: ClubPostsService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  createPost(
    @ClubMember() clubMember: ClubMembers,
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() body: CreatePostBody,
  ): Promise<void> {
    return this.clubPostsService.createPost(clubId, clubMember.id, body);
  }

  @ApiOperation({ summary: '클럽 게시판 사진 업로드' })
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      // // 이미지 파일인지
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(
            new UnsupportedMediaTypeException(
              '이미지파일이 아닙니다. jpg|jpeg|png|gif',
            ),
            false,
          );
        }
      },
      // 경로 저장
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'uploads/club-posts');
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const baseName = basename(file.originalname, ext);
          cb(null, `${baseName}-${Date.now() + ''}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Post('images')
  savePostImage(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
    return this.configService.get<string>('NODE_ENV') !== 'production'
      ? files.map((file) => `/uploads/club-posts/${file.filename}`)
      : [];
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
