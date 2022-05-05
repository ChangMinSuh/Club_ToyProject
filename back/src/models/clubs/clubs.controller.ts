import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { User } from 'src/common/decorators/user.decorator';
import { ClubsService } from './clubs.service';
import { CreateClubBody } from './dtos/create-club.dto';
import { Clubs } from './entities/clubs.entity';
import { Users } from '../users/entities/users.entity';
import { ClubRolesGuard } from 'src/common/guards/club-roles.guard';
import { ClubRoles } from 'src/common/decorators/clubs-roles.decorator';
import { ClubMembersRoleEnum } from '../club-members/entities/club-members.entity';

@ApiTags('clubs')
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @ApiOperation({ summary: '클럽 만들기' })
  @UseGuards(JwtAccessGuard)
  @Post()
  async createClub(
    @User() user: Users,
    @Body() body: CreateClubBody,
  ): Promise<void> {
    await this.clubsService.createClub(user.id, body);
    return;
  }

  @ApiOperation({ summary: '모든 클럽 가져오기' })
  @Get()
  async findAllClubs(): Promise<Clubs[]> {
    return await this.clubsService.findAllClubs();
  }

  @ApiOperation({ summary: '내 클럽 모두 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get('me')
  async findMyClubs(@User() user: Users): Promise<Clubs[]> {
    return await this.clubsService.findMyClubs(user.id);
  }

  @ApiOperation({ summary: '대기중 지원서 모두 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get('me/app/answers')
  async findMyAppAnswers(@User() user: Users) {
    return await this.clubsService.findMyWatingAppAnswers(user.id);
  }

  @ApiOperation({ summary: '클럽 정보 가져오기' })
  @ClubRoles(ClubMembersRoleEnum.Manager, ClubMembersRoleEnum.User)
  @UseGuards(JwtAccessGuard, ClubRolesGuard)
  @Get(':clubId')
  findOneClub(@Param('clubId', ParseIntPipe) clubId: number): Promise<Clubs> {
    return this.clubsService.findOneClub(clubId);
  }
}
