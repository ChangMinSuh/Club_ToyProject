import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { Users } from 'src/models/users/entities/users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.body?.refresh_token?.slice(7),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request): Promise<Users> {
    const access_token = req?.headers['authorization']?.slice(7);
    const refresh_token = req.body?.refresh_token?.slice(7);
    const decodedAccessToken = this.jwtService.decode(access_token);
    if (typeof decodedAccessToken === 'string' || decodedAccessToken === null)
      throw new UnauthorizedException('access token error');

    const user = await this.authService.getUserIfRefreshTokenMatches(
      refresh_token,
      decodedAccessToken,
    );
    return user;
  }
}
