import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { Users } from 'src/models/users/entities/users.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.Refresh,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<Users> {
    const { Authentication: accessToken, Refresh: refreshToken } = req.cookies;

    const decodedAccessToken = this.jwtService.decode(accessToken);
    if (typeof decodedAccessToken === 'string' || decodedAccessToken === null)
      throw new UnauthorizedException('access token error');

    const user = await this.authService.getUserIfRefreshTokenMatches({
      refreshToken,
      decodedAccessToken,
    });
    return user;
  }
}
