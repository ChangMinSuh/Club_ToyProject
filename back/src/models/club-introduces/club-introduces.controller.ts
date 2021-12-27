import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { ClubRoles } from 'src/common/decorators/clubs-roles.decorator';
import { ClubRolesGuard } from 'src/common/guards/club-roles.guard';
import { ClubMembersRoleEnum } from '../club-members/entities/club-members.entity';
import { ClubIntroducesService } from './club-introduces.service';
import { CreateIntroduceBody } from './dtos/create-introduce.dto';
import { UpdateIntroduceBody } from './dtos/update-introduce.dto';
import { ClubIntroduces } from './entities/club-introduces.entity';

@Controller('clubs/:clubId/introduce')
export class ClubIntroducesController {
  constructor(private readonly clubIntroducesService: ClubIntroducesService) {}

  @Post()
  @ClubRoles(ClubMembersRoleEnum.Manager)
  @UseGuards(JwtAccessGuard, ClubRolesGuard)
  createIntroduce(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() body: CreateIntroduceBody,
  ): Promise<void> {
    return this.clubIntroducesService.createIntroduce(clubId, body);
  }

  @ApiOperation({ summary: '클럽 소개내용 가져오기' })
  @Get()
  findIntroduce(
    @Param('clubId', ParseIntPipe) clubId: number,
  ): Promise<ClubIntroduces> {
    return this.clubIntroducesService.findIntroduce(clubId);
  }

  @Patch()
  @ClubRoles(ClubMembersRoleEnum.Manager)
  @UseGuards(JwtAccessGuard, ClubRolesGuard)
  updateIntroduce(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() body: UpdateIntroduceBody,
  ): Promise<void> {
    return this.clubIntroducesService.updateIntroduce(clubId, body);
  }

  @Delete()
  @ClubRoles(ClubMembersRoleEnum.Manager)
  @UseGuards(JwtAccessGuard, ClubRolesGuard)
  removeIntroduce(
    @Param('clubId', ParseIntPipe) clubId: number,
  ): Promise<void> {
    return this.clubIntroducesService.removeIntroduce(clubId);
  }
}
