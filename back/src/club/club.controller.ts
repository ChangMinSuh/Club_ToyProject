import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateUserDto } from 'src/auth/dto/validate-user';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { User } from 'src/common/decorators/user.decorator';
import { ClubService } from './club.service';
import { SetClubDto } from './dto/set-club.dto';

@ApiTags('clubs')
@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @ApiOperation({ summary: '모든 클럽 가져오기' })
  @Get()
  findAll() {
    return this.clubService.findAllClubs();
  }

  @ApiOperation({ summary: '클럽 만들기' })
  @UseGuards(JwtAccessGuard)
  @Post()
  async setClub(@Body() body: SetClubDto, @User() { userId }: ValidateUserDto) {
    return await this.clubService.setClub(body, userId);
  }

  @ApiOperation({ summary: '내 클럽 모두 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get('my')
  async findMyClubs(@User() { userId }: ValidateUserDto) {
    return await this.clubService.findMyClubs(userId);
  }

  @ApiOperation({ summary: ' 클럽 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.clubService.findOneClub(name);
  }

  @ApiOperation({ summary: ' 클럽 가져오기' })
  @UseGuards(JwtAccessGuard)
  @Get(':name/chats')
  getClubChat(@Param('name') name: string) {
    return this.clubService.getClubChat(name);
  }
}
