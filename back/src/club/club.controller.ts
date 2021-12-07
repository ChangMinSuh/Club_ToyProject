import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateUserDto } from 'src/auth/dto/validate-user';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { GetClubChatsDataDto } from 'src/club-chat/dto/get-clubchats-data.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ClubService } from './club.service';
import { GetClubDto } from './dto/get-club.dto';
import { SetClubBodyDto } from './dto/set-club-body.dto';

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

  @ApiOperation({ summary: ' 클럽 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get(':name')
  findOne(
    @User() { userId }: ValidateUserDto,
    @Param('name') name: string,
  ): Promise<GetClubDto> {
    return this.clubService.findOneClub({ name, userId });
  }

  @ApiOperation({ summary: ' 클럽 채팅 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get(':name/chats')
  getClubChat(@Param('name') name: string): Promise<GetClubChatsDataDto[]> {
    return this.clubService.getClubChat({ name });
  }
}
