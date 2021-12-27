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
import { ClubRoles } from 'src/common/decorators/clubs-roles.decorator';
import { ClubRolesGuard } from 'src/common/guards/club-roles.guard';
import { ClubMembersService } from './club-members.service';
import { CreateMemberBody } from './dtos/create-member.dto';
import {
  ClubMembers,
  ClubMembersRoleEnum,
} from './entities/club-members.entity';
@Controller('clubs/:clubId/members')
export class ClubMembersController {
  constructor(private readonly clubMembersService: ClubMembersService) {}

  @ApiOperation({ summary: '클럽 멤버 추가하고, 지원서 업데이트' })
  @ClubRoles(ClubMembersRoleEnum.Manager)
  @UseGuards(JwtAccessGuard, ClubRolesGuard)
  @Post()
  createMember(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() { userId, clubAppAnswerId }: CreateMemberBody,
  ): Promise<void> {
    return this.clubMembersService.createMemberAndUpdateAppAnswer(
      clubId,
      userId,
      clubAppAnswerId,
    );
  }

  @ApiOperation({ summary: '클럽 멤버 정보 모두 가져오기' })
  @ClubRoles(ClubMembersRoleEnum.Manager, ClubMembersRoleEnum.User)
  @UseGuards(JwtAccessGuard, ClubRolesGuard)
  @Get()
  findAllMembers(
    @Param('clubId', ParseIntPipe) clubId: number,
  ): Promise<ClubMembers[]> {
    return this.clubMembersService.findAllMembers(clubId);
  }
}
