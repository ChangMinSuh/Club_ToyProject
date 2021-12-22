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
import { UserClubsManagerGuard } from '../clubs/guard/user-clubs.guard';
import { ClubAppQuestionsService } from './club-app-questions.service';

@Controller('clubs/:clubId/app/questions')
export class ClubAppQuestionsController {
  constructor(
    private readonly clubAppQuestionsService: ClubAppQuestionsService,
  ) {}

  @ApiOperation({ summary: '클럽 지원서 질문 저장하기' })
  @UseGuards(JwtAccessGuard, UserClubsManagerGuard)
  @Post()
  createAppQuestion(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() body,
  ) {
    return this.clubAppQuestionsService.createAppQuestion(clubId, body);
  }

  @ApiOperation({ summary: '클럽 지원서 질문 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get()
  findAppQuestions(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubAppQuestionsService.findAppQuestions(clubId);
  }

  @ApiOperation({ summary: '클럽 지원서 질문 수정' })
  @UseGuards(JwtAccessGuard, UserClubsManagerGuard)
  @Patch(':clubAppQuestionId')
  updateAppQuestion(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('clubAppQuestionId', ParseIntPipe) clubAppQuestionId: number,
    @Body() body,
  ) {
    return this.clubAppQuestionsService.updateAppQuestion(
      clubId,
      clubAppQuestionId,
      body,
    );
  }

  @ApiOperation({ summary: '클럽 지원서 질문 삭제' })
  @UseGuards(JwtAccessGuard, UserClubsManagerGuard)
  @Delete(':clubAppQuestionId')
  removeAppQuestion(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('clubAppQuestionId', ParseIntPipe) clubAppQuestionId: number,
  ) {
    return this.clubAppQuestionsService.removeAppQuestion(
      clubId,
      clubAppQuestionId,
    );
  }
}
