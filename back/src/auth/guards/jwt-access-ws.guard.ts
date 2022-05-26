import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth.service';

// ws를 위한 guard. jwt service 때문에 module에서 import 해야함.
@Injectable()
export class JwtAccessWsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const reqWs = context.switchToWs();
    console.log(reqWs.getClient());
    const access_token: string =
      reqWs.getClient().handshake.auth['access_token'];
    console.log('socket io access_token:', access_token);

    if (!access_token) throw new WsException('no access token');
    try {
      const { id: userId } = await this.jwtService.verifyAsync(access_token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
      const user = await this.authService.getUserInDb(userId);
      context.switchToWs().getData().user = user;
      return Boolean(user);
    } catch (err) {
      console.log(err);
      throw new WsException(err.message);
    }
  }
}
