import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

// ws를 위한 guard. jwt service 때문에 module에서 import 해야함.
@Injectable()
export class JwtAccessWsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const reqWs = context.switchToWs();
    const cookies: string[] = reqWs
      .getClient()
      .handshake.headers.cookie.split('; ');
    const accessToken = cookies
      .find((cookie: string) => cookie.startsWith('Authentication='))
      .split('=')[1];
    if (!accessToken) throw new UnauthorizedException('no access token');
    const { id: userId } = await this.jwtService.verify(accessToken, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
    const user = await this.authService.getUserInDb(userId);
    context.switchToWs().getData().user = user;
    return Boolean(user);
  }
}
