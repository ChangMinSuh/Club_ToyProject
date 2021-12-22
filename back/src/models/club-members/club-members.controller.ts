import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { UserClubsManagerGuard } from '../clubs/guard/user-clubs.guard';
import { ClubMembersService } from './club-members.service';
@Controller('clubs/:clubId/members')
export class ClubMembersController {
  constructor(private readonly clubMembersService: ClubMembersService) {}

  @ApiOperation({ summary: '클럽 유저 추가하기' })
  @UseGuards(JwtAccessGuard, UserClubsManagerGuard)
  @Post()
  createMember(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() { userId },
  ) {
    return this.clubMembersService.createMember(clubId, userId);
  }

  @ApiOperation({ summary: '클럽 멤버 정보 모두 가져오기' })
  @UseGuards(JwtAccessGuard, UserClubsManagerGuard)
  @Get()
  findAllMembers(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubMembersService.findAllMembers(clubId);
  }
}
