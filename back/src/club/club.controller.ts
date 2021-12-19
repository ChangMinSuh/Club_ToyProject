import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateUserDto } from 'src/auth/dto/validate-user';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { GetClubChatsDataDto } from 'src/club-chat/dto/get-clubchats-data.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ClubService } from './club.service';
import { GetClubAppQuestionsDto } from './dto/get-club-app-questions.dto';
import { GetClubDto } from './dto/get-club.dto';
import { SetClubAppQuestionBodyDto } from './dto/set-club-app-question-body.dto';
import { SetClubBodyDto } from './dto/set-club-body.dto';
import { UserClubsManagerGuard } from './guard/user-clubs.guard';

@ApiTags('clubs')
@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @ApiOperation({ summary: '모든 클럽 가져오기' })
  @Get()
  async findAll(): Promise<GetClubDto[]> {
    return await this.clubService.findAllClubs();
  }

  @ApiOperation({ summary: '클럽 만들기' })
  @UseGuards(JwtAccessGuard)
  @Post()
  async setClub(
    @Body() body: SetClubBodyDto,
    @User() { userId }: ValidateUserDto,
  ): Promise<string> {
    return await this.clubService.setClub(userId, body);
  }

  @ApiOperation({ summary: '내 클럽 모두 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get('my')
  async findMyClubs(
    @User() { userId }: ValidateUserDto,
  ): Promise<GetClubDto[]> {
    return await this.clubService.findMyClubs({ userId });
  }

  @ApiOperation({ summary: '내 클럽 지원서 모두 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get('my/app_question_answers')
  async findMyAppQuestionAnswers(@User() { userId }: ValidateUserDto) {
    return await this.clubService.findMyAppQuestionAnswers({ userId });
  }

  @ApiOperation({ summary: '클럽 정보 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get(':clubId')
  findOne(
    @User() { userId }: ValidateUserDto,
    @Param('clubId', ParseIntPipe) clubId: number,
  ): Promise<GetClubDto> {
    return this.clubService.findOneClub({ clubId, userId });
  }

  @ApiOperation({ summary: '클럽 채팅 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get(':clubId/chats')
  getClubChat(
    @Param('clubId', ParseIntPipe) clubId: number,
  ): Promise<GetClubChatsDataDto[]> {
    return this.clubService.getClubChat({ clubId });
  }

  @ApiOperation({ summary: '클럽 소개내용 가져오기' })
  @Get(':clubId/introduce')
  getClubIntroduce(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubService.getClubIntroduce({ clubId });
  }

  @ApiOperation({ summary: '클럽 유저 정보 모두 가져오기' })
  @UseGuards(JwtAccessGuard, UserClubsManagerGuard)
  @Get(':clubId/users')
  findAllUsersImpormation(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubService.findAllUsersImpormation(clubId);
  }

  @ApiOperation({ summary: '클럽 유저 추가하기' })
  @UseGuards(JwtAccessGuard, UserClubsManagerGuard)
  @Post(':clubId/users')
  addUserClubs(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() { userId },
  ) {
    return this.clubService.addUserClubs({ clubId, userId });
  }

  @ApiOperation({ summary: '클럽 지원서 질문 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get(':clubId/app_question')
  getAppQuestion(
    @Param('clubId', ParseIntPipe) clubId: number,
  ): Promise<GetClubAppQuestionsDto[]> {
    return this.clubService.getAppQuestions({ clubId });
  }

  @ApiOperation({ summary: '클럽 지원서 질문 저장하기' })
  @UseGuards(JwtAccessGuard, UserClubsManagerGuard)
  @Post(':clubId/app_question')
  setAppQuestion(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() body: SetClubAppQuestionBodyDto,
  ): Promise<GetClubAppQuestionsDto> {
    return this.clubService.setAppQuestions(clubId, body);
  }

  @ApiOperation({ summary: '클럽 지원서 질문 수정' })
  @UseGuards(JwtAccessGuard, UserClubsManagerGuard)
  @Patch(':clubId/app_question/:clubAppQuestionId')
  updateAppQuestion(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('clubAppQuestionId', ParseIntPipe) clubAppQuestionId: number,
    @Body() body,
  ): Promise<GetClubAppQuestionsDto> {
    return this.clubService.updateAppQuestions(clubId, clubAppQuestionId, body);
  }

  @ApiOperation({ summary: '클럽 지원서 질문 삭제' })
  @UseGuards(JwtAccessGuard, UserClubsManagerGuard)
  @Delete(':clubId/app_question/:clubAppQuestionId')
  deleteAppQuestion(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('clubAppQuestionId', ParseIntPipe) clubAppQuestionId: number,
    @Body() body,
  ) {
    return this.clubService.deleteAppQuestions(clubId, clubAppQuestionId);
  }

  @ApiOperation({ summary: '클럽 지원서 저장하기' })
  @UseGuards(JwtAccessGuard)
  @Post(':clubId/app_question_answers')
  pushAppQuestionAnswer(
    @Param('clubId', ParseIntPipe) clubId: number,
    @User() { userId }: ValidateUserDto,
    @Body() body,
  ) {
    return this.clubService.setAppQuestionAnswers(clubId, userId, body);
  }

  @ApiOperation({ summary: '클럽 지원서 모두 가져오기' })
  @UseGuards(JwtAccessGuard, UserClubsManagerGuard)
  @Get(':clubId/app_question_answers')
  findAllNewAppQuestionAnswers(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubService.findAllNewAppQuestionAnswers(clubId);
  }
}
