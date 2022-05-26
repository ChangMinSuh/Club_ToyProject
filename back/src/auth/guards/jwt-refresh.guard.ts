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
    const access_token = req?.headers['authorization']?.slice(7);
    const refresh_token = req.body?.refresh_token;
    if (!access_token) throw new UnauthorizedException('no access token');
    if (!refresh_token) throw new UnauthorizedException('no refresh token');
    // 변조되지 않은 accessToken인지 check
    try {
      await this.jwtService.verifyAsync(access_token);
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
