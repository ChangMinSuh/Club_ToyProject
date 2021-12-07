import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { ValidateUserDto } from './dto/validate-user';
import { SignUpUserDto } from './dto/signUp-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 로그인 정보 확인
  @Post('load')
  @UseGuards(JwtAccessGuard)
  async loadUser(@User() user: ValidateUserDto): Promise<ValidateUserDto> {
    return user;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @User() user: ValidateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ValidateUserDto> {
    const [
      { token: accessToken, ...accessTokenOption },
      { token: refreshToken, ...refreshTokenOption },
    ] = await Promise.all([
      this.authService.getCookieWithAccessToken(user),
      this.authService.getCookieWithRefreshToken(),
    ]);
    await this.authService.setRefreshTokenInDb({
      refreshToken,
      userId: user.userId,
    });

    res.cookie('Authentication', accessToken, accessTokenOption);
    res.cookie('Refresh', refreshToken, refreshTokenOption);
    return user;
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @User() user: ValidateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ValidateUserDto> {
    const { token: accessToken, ...accessTokenOption } =
      await this.authService.getCookieWithAccessToken(user);
    res.cookie('Authentication', accessToken, accessTokenOption);
    return user;
  }

  @Post('logout')
  @UseGuards(JwtAccessGuard)
  async logout(
    @User() user: ValidateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.deleteRefreshTokenInDb({ userId: user.userId });
    res.clearCookie('Authentication');
    res.clearCookie('Refresh');
    return {
      message: 'success',
    };
  }

  @Post('signup')
  async signUp(@Body() body: SignUpUserDto) {
    await this.authService.signUp(body);
    return {
      message: 'success',
    };
  }
}
