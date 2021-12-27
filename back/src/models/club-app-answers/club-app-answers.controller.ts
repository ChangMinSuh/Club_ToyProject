import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateUserDto } from 'src/auth/dto/validate-user';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { ClubRoles } from 'src/common/decorators/clubs-roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ClubRolesGuard } from 'src/common/guards/club-roles.guard';
import { ClubMembersRoleEnum } from '../club-members/entities/club-members.entity';
import { Users } from '../users/entities/users.entity';
import { ClubAppAnswersService } from './club-app-answers.service';
import {
  ClubAppAnswers,
  ClubAppAnswerStatusEnum,
} from './entities/club-app-answers.entity';

@ApiTags('클럽 지원서 답변')
@Controller('clubs/:clubId/app/answers')
export class ClubAppAnswersController {
  constructor(private readonly clubAppAnswersService: ClubAppAnswersService) {}

  @ApiOperation({ summary: '클럽 지원서 저장하기' })
  @UseGuards(JwtAccessGuard)
  @Post()
  createAppAnswer(
    @Param('clubId', ParseIntPipe) clubId: number,
    @User() user: Users,
    @Body() body,
  ): Promise<void> {
    return this.clubAppAnswersService.createAppAnswer(clubId, user.id, body);
  }

  @ApiOperation({
    summary: '클럽지원서 모두 가져오기',
  })
  @ClubRoles(ClubMembersRoleEnum.Manager)
  @UseGuards(JwtAccessGuard, ClubRolesGuard)
  @Get()
  findAllAppAnswersNotMembers(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Query('status') status: ClubAppAnswerStatusEnum,
  ): Promise<ClubAppAnswers[]> {
    return this.clubAppAnswersService.findAllAppAnswers(clubId, status);
  }
}
