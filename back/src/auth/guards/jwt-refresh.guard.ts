import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { Authentication: accessToken, Refresh: refreshToken } = req.cookies;
    if (!accessToken) throw new UnauthorizedException('no access token');
    if (!refreshToken) throw new UnauthorizedException('no refresh token');
    // 변조되지 않은 accessToken인지 check
    try {
      await this.jwtService.verifyAsync(accessToken);
    } catch (err) {
      if (err.message !== 'jwt expired')
        throw new UnauthorizedException(err.message);
    }
    return this.activate(context);
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException(info);
    }
    return user;
  }
}
