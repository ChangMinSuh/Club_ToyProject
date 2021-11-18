import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CookieTokenDto } from './dto/cookie-token.dto';
import { Cache } from 'cache-manager';
import { SignUpUserDto } from './dto/signUp-user.dto';
import { ValidateUserDto } from './dto/validate-user';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly redisManager: Cache,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['email', 'password', 'nickname', 'id'],
    });
    if (!user) {
      return null;
    }
    const isPasswordComplete = await bcrypt.compare(password, user.password);
    if (!isPasswordComplete) {
      return null;
    }
    const { password: X_password, ...result } = user;
    return result;
  }

  async getCookieWithAccessToken(payload: any): Promise<CookieTokenDto> {
    console.log('hi', process.env.JWT_ACCESS_EXPIRY_TIME);
    console.log(payload);
    const token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: Number(process.env.JWT_ACCESS_EXPIRY_TIME),
    });
    return {
      token: token,
      domain: 'localhost',
      httpOnly: true,
      path: '/',
    };
  }

  async getCookieWithRefreshToken(): Promise<CookieTokenDto> {
    const payload = {};
    const token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRY_TIME),
    });
    return {
      token: token,
      domain: 'localhost',
      httpOnly: true,
      path: '/',
    };
  }

  async setRefreshTokenInDb(refreshToken: string, userId: number) {
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.redisManager.set(userId.toString(), hashRefreshToken, {
      ttl: Number(process.env.JWT_REFRESH_EXPIRY_TIME),
    });
  }

  async deleteRefreshTokenInDb(userId: number) {
    await this.redisManager.del(userId.toString());
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    decodedAccessToken: any,
  ): null | Promise<ValidateUserDto> {
    const { userId, nickname, email } = decodedAccessToken;
    const currentHashedRefreshToken = await this.redisManager.get(userId);
    if (currentHashedRefreshToken === null)
      throw new UnauthorizedException('refresh token is not in db');

    const isRefreshTokenCorrect = await bcrypt.compare(
      refreshToken,
      currentHashedRefreshToken,
    );
    if (!isRefreshTokenCorrect) return null;

    return { userId, nickname, email };
  }

  async signUp({ email, password, nickname }: SignUpUserDto) {
    const chkUser = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    if (chkUser) throw new ConflictException('This email exists.');

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new Users();
    newUser.email = email;
    newUser.password = hashPassword;
    newUser.nickname = nickname;
    await this.usersRepository.save(newUser);
  }
}
