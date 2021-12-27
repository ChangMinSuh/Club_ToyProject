import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Users } from 'src/models/users/entities/users.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.Authentication,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(user): Promise<Users> {
    console.log('access-token의 payload:', user.id);
    const result = await this.authService.getUserInDb(user.id);
    console.log('redis의 user:', result);
    return result;
  }
}
