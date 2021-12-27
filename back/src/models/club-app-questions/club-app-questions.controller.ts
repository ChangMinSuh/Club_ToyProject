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
import { ApiOperation } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { ClubRoles } from 'src/common/decorators/clubs-roles.decorator';
import { ClubRolesGuard } from 'src/common/guards/club-roles.guard';
import { ClubMembersRoleEnum } from '../club-members/entities/club-members.entity';
import { ClubAppQuestionsService } from './club-app-questions.service';
import { CreateAppQuestionBody } from './dtos/create-app-question.dto';
import { UpdateAppQuestionBody } from './dtos/update-app-question.dto';
import { ClubAppQuestions } from './entities/club-app-questions.entity';

@Controller('clubs/:clubId/app/questions')
export class ClubAppQuestionsController {
  constructor(
    private readonly clubAppQuestionsService: ClubAppQuestionsService,
  ) {}

  @ApiOperation({ summary: '클럽 지원서 질문 저장하기' })
  @ClubRoles(ClubMembersRoleEnum.Manager)
  @UseGuards(JwtAccessGuard, ClubRolesGuard)
  @Post()
  createAppQuestion(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() body: CreateAppQuestionBody,
  ): Promise<ClubAppQuestions> {
    return this.clubAppQuestionsService.createAppQuestion(clubId, body);
  }

  @ApiOperation({ summary: '클럽 지원서 질문 가져오기' })
  @Get()
  findAppQuestions(
    @Param('clubId', ParseIntPipe) clubId: number,
  ): Promise<ClubAppQuestions[]> {
    return this.clubAppQuestionsService.findAppQuestions(clubId);
  }

  @ApiOperation({ summary: '클럽 지원서 질문 수정' })
  @ClubRoles(ClubMembersRoleEnum.Manager)
  @UseGuards(JwtAccessGuard, ClubRolesGuard)
  @Patch(':clubAppQuestionId')
  updateAppQuestion(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('clubAppQuestionId', ParseIntPipe) clubAppQuestionId: number,
    @Body() body: UpdateAppQuestionBody,
  ): Promise<ClubAppQuestions> {
    return this.clubAppQuestionsService.updateAppQuestion(
      clubId,
      clubAppQuestionId,
      body,
    );
  }

  @ApiOperation({ summary: '클럽 지원서 질문 삭제' })
  @ClubRoles(ClubMembersRoleEnum.Manager)
  @UseGuards(JwtAccessGuard, ClubRolesGuard)
  @Delete(':clubAppQuestionId')
  removeAppQuestion(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('clubAppQuestionId', ParseIntPipe) clubAppQuestionId: number,
  ): Promise<void> {
    return this.clubAppQuestionsService.removeAppQuestion(
      clubId,
      clubAppQuestionId,
    );
  }
}
