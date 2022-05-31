import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnsupportedMediaTypeException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { basename, extname } from 'path';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { ClubRoles } from 'src/common/decorators/clubs-roles.decorator';
import { ClubRolesGuard } from 'src/common/guards/club-roles.guard';
import {
  ClubMembers,
  ClubMembersRoleEnum,
} from '../club-members/entities/club-members.entity';
import { ClubFilesService } from './club-files.service';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import { ClubMember } from 'src/common/decorators/club-member.decorator';

const s3 = new AWS.S3();

@ClubRoles(ClubMembersRoleEnum.Manager, ClubMembersRoleEnum.User)
@UseGuards(JwtAccessGuard, ClubRolesGuard)
@Controller('clubs/:clubId')
export class ClubFilesController {
  constructor(
    private readonly ClubFilesService: ClubFilesService,
    private readonly configService: ConfigService,
  ) {}

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
      storage: multerS3({
        s3: s3,
        bucket: `sweetclub/club-images`,
        acl: 'public-read',
        key: function (req, file, cb) {
          const ext = extname(file.originalname);
          const baseName = basename(file.originalname, ext);
          cb(null, `${baseName}-${Date.now() + ''}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Post('images')
  savePostImage(
    @UploadedFiles() files: Express.MulterS3.File[],
    @Param('clubId', ParseIntPipe) clubId: number,
    @ClubMember() clubMember: ClubMembers,
  ) {
    return this.ClubFilesService.uploadFiles(clubId, clubMember.id, files);
    //return files.map((file) => `/uploads/club-posts/${file.filename}`);
  }

  @ApiOperation({ summary: '클럽 멤버의 모든 이미지 가져오기' })
  @Get('images/member')
  findClubMemberImages(@ClubMember() clubMember: ClubMembers) {
    return this.ClubFilesService.findClubMemberImages(clubMember.id);
  }

  @ApiOperation({ summary: '클럽 파일 업데이트' })
  @Patch('files/:fileId')
  updateFile(
    @Param('fileId', ParseIntPipe) fileId: number,
    @Body() body: { isShow: boolean },
  ) {
    return this.ClubFilesService.updateFile(fileId, body);
  }

  @ApiOperation({ summary: '클럽 파일 삭제' })
  @Delete('files/:fileId')
  removeFile(@Param('fileId', ParseIntPipe) fileId: number) {
    return this.ClubFilesService.deleteFile(fileId);
  }
}
