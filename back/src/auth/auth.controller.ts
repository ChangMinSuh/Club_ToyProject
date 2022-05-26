import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { ApiTags } from '@nestjs/swagger';
import { Users } from 'src/models/users/entities/users.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @User() user: Users,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string; refresh_token: string; user: Users }> {
    const [
      { token: access_token, ...accessTokenOption },
      { token: refresh_token, ...refreshTokenOption },
    ] = await Promise.all([
      this.authService.getCookieWithAccessToken({ id: user.id }),
      this.authService.getCookieWithRefreshToken(),
    ]);

    await this.authService.setRefreshTokenInDb(refresh_token, user.id);
    try {
      await this.authService.setUserInDb(user);
    } catch (err) {
      await this.authService.deleteRefreshTokenInDb(user.id);
      throw new Error(err);
    }

    // redis 실패했을 때 어떻게 할지 작성
    res.cookie('auth.strategy', 'local', { httpOnly: true });
    res.cookie('auth.access_token.local', access_token, accessTokenOption);
    res.cookie('auth.refresh_token.local', refresh_token, refreshTokenOption);
    return { access_token, refresh_token, user };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @User() user: Users,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    access_token: string;
    user: Users;
  }> {
    const { token: access_token, ...access_token_option } =
      await this.authService.getCookieWithAccessToken({ id: user.id });
    res.cookie('auth.access_token.local', access_token, access_token_option);
    console.log('refresh access_token'access_token);
    return { access_token, user };
  }

  @Post('logout')
  @UseGuards(JwtAccessGuard)
  async logout(
    @User() user: Users,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await Promise.all([
      this.authService.deleteRefreshTokenInDb(user.id),
      this.authService.deleteUserInDb(user.id),
    ]);
    res.clearCookie('Authentication');
    res.clearCookie('Refresh');
    return;
  }

  // 로그인 정보 확인
  @Get()
  @UseGuards(JwtAccessGuard)
  async loadUser(@User() user: Users): Promise<Users> {
    return user;
  }
}
