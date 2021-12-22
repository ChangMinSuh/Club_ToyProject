import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateUserDto } from 'src/auth/dto/validate-user';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UserClubsManagerGuard } from '../clubs/guard/user-clubs.guard';
import { ClubAppAnswersService } from './club-app-answers.service';
import { CreateClubAppAnswerBodyDto } from './dto/create-club-app-answer-body.dto';

@ApiTags('클럽 지원서 답변')
@Controller('clubs/:clubId/app/answers')
export class ClubAppAnswersController {
  constructor(private readonly clubAppAnswersService: ClubAppAnswersService) {}

  @ApiOperation({ summary: '클럽 지원서 저장하기' })
  @UseGuards(JwtAccessGuard)
  @Post()
  create(
    @Param('clubId', ParseIntPipe) clubId: number,
    @User() { userId }: ValidateUserDto,
    @Body() body: CreateClubAppAnswerBodyDto,
  ) {
    return this.clubAppAnswersService.create(clubId, userId, body);
  }

  // Users를 반환하지만, Club에 지원한 사람이기 때문에 여기에 남겨놨다.
  @ApiOperation({
    summary: '미가입자 유저들을 클럽 지원서와 함께 모두 가져오기',
  })
  @UseGuards(JwtAccessGuard, UserClubsManagerGuard)
  @Get()
  findAllAppAnswersNotMembers(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubAppAnswersService.findAllAppAnswersNotMembers(clubId);
  }
}
