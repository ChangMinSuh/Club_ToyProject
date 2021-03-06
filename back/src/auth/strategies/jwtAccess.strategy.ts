import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Users } from 'src/models/users/entities/users.entity';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { ValidateUserBefore } from '../dto/validate-user.dto';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(user: ValidateUserBefore): Promise<Users> {
    const result = await this.authService.getUserInDb(user.id);
    return result;
  }
}
