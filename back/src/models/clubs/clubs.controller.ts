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
import { GetClubChatsDataDto } from 'src/models/club-chats/dto/get-clubchats-data.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ClubsService } from './clubs.service';
import { GetClubDto } from './dto/get-club.dto';
import { SetClubBodyDto } from './dto/set-club-body.dto';

@ApiTags('clubs')
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @ApiOperation({ summary: '클럽 만들기' })
  @UseGuards(JwtAccessGuard)
  @Post()
  async setClub(
    @Body() body: SetClubBodyDto,
    @User() { userId }: ValidateUserDto,
  ): Promise<string> {
    return await this.clubsService.setClub(userId, body);
  }

  @ApiOperation({ summary: '모든 클럽 가져오기' })
  @Get()
  async findAll(): Promise<GetClubDto[]> {
    return await this.clubsService.findAllClubs();
  }

  @ApiOperation({ summary: '내 클럽 모두 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get('me')
  async findMyClubs(
    @User() { userId }: ValidateUserDto,
  ): Promise<GetClubDto[]> {
    return await this.clubsService.findMyClubs({ userId });
  }

  @ApiOperation({ summary: '내 클럽에 지원서 포함하여 모두 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get('me/app/answers')
  async findMyAppAnswers(@User() { userId }: ValidateUserDto) {
    return await this.clubsService.findMyAppAnswers(userId);
  }

  @ApiOperation({ summary: '클럽 정보 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get(':clubId')
  findOne(
    @User() { userId }: ValidateUserDto,
    @Param('clubId', ParseIntPipe) clubId: number,
  ): Promise<GetClubDto> {
    return this.clubsService.findOneClub({ clubId, userId });
  }

  @ApiOperation({ summary: '클럽 채팅 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get(':clubId/chats')
  getClubChat(
    @Param('clubId', ParseIntPipe) clubId: number,
  ): Promise<GetClubChatsDataDto[]> {
    return this.clubsService.getClubChat({ clubId });
  }
}
