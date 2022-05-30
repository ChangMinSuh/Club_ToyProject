import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access-token') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const access_token = req?.headers['authorization']?.slice(7);
    if (!access_token) throw new UnauthorizedException('no access token');
    return this.activate(context);
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest<TUser = any>(
    err: Error,
    user: any,
    info: string | Error,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException(info);
    }
    return user;
  }
}
