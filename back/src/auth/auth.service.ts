import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/models/users/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CookieTokenDto } from './dto/cookie-token.dto';
import { Cache } from 'cache-manager';
import { ValidateUserReturn } from './dto/validate-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly redisManager: Cache,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<ValidateUserReturn> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .select('users')
      .addSelect('users.password')
      .leftJoinAndSelect('users.ClubMembers', 'clubMembers')
      .where('users.email = :email', { email })
      .getOne();
    if (!user) {
      throw new UnauthorizedException('Is not correct');
    }
    const isPasswordComplete = await bcrypt.compare(password, user.password);
    if (!isPasswordComplete) {
      throw new UnauthorizedException('Is not correct');
    }

    const { password: _password, ...result } = user;

    return result;
  }

  async getCookieWithAccessToken(payload: any): Promise<CookieTokenDto> {
    const token = await this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: Number(this.configService.get('JWT_ACCESS_EXPIRY_TIME')),
    });
    return {
      token: token,
      domain:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? this.configService.get<string>('SITE_DOMAIN')
          : 'localhost',
      httpOnly: true,
      path: '/',
    };
  }

  async getCookieWithRefreshToken(): Promise<CookieTokenDto> {
    const payload = {};
    const token = await this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: Number(this.configService.get('JWT_REFRESH_EXPIRY_TIME')),
    });
    return {
      token: token,
      domain:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? this.configService.get<string>('SITE_DOMAIN')
          : 'localhost',
      httpOnly: true,
      path: '/',
    };
  }

  async setRefreshTokenInDb(
    refreshToken: string,
    userId: number,
  ): Promise<void> {
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.redisManager.set(`user:refresh:${userId}`, hashRefreshToken, {
      ttl: Number(this.configService.get('JWT_REFRESH_EXPIRY_TIME')),
    });
  }

  async deleteRefreshTokenInDb(userId: number): Promise<void> {
    await this.redisManager.del(`user:refresh:${userId}`);
  }

  async setUserInDb(user: Users): Promise<void> {
    await this.redisManager.set(`user:${user.id}`, user, {
      ttl: Number(this.configService.get('JWT_REFRESH_EXPIRY_TIME')),
    });
  }

  async getUserInDb(userId: number): Promise<Users> {
    const result = await this.redisManager.get<Users>(`user:${userId}`);
    return result;
  }

  async deleteUserInDb(userId: number) {
    await this.redisManager.del(`user:${userId}`);
  }

  async getUserIfRefreshTokenMatches(
    refresh_token: string,
    decodedAccessToken: {
      [key: string]: any;
    },
  ): Promise<Users> {
    const { id } = decodedAccessToken;
    const currentHashedRefreshToken = await this.redisManager.get<string>(
      `user:refresh:${id}`,
    );
    if (currentHashedRefreshToken === null)
      throw new UnauthorizedException('refresh token is not in db');

    const isRefreshTokenCorrect = await bcrypt.compare(
      refresh_token,
      currentHashedRefreshToken,
    );
    if (!isRefreshTokenCorrect)
      throw new UnauthorizedException('refresh token is not compare');

    const result = await this.redisManager.get<Users>(`user:${id}`);
    return result;
  }
}
