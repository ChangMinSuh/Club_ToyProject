import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/models/users/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CookieTokenDto } from './dto/cookie-token.dto';
import { Cache } from 'cache-manager';
import { SignUpUserDto } from './dto/signUp-user.dto';
import { ValidateUserDto } from './dto/validate-user';
import { ClubMembersRoleEnum } from 'src/models/club-members/entities/club-members.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly redisManager: Cache,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ email, password }): Promise<ValidateUserDto | null> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoin(
        'users.ClubMembers',
        'clubMembers',
        'clubMembers.role = :role',
        {
          role: ClubMembersRoleEnum.Manager,
        },
      )
      .select('users')
      .addSelect('users.password')
      .addSelect(['clubMembers.ClubId'])
      .where('users.email = :email', { email })
      .getOne();
    if (!user) {
      throw new UnauthorizedException('Is not correct');
    }
    console.log(user);
    const isPasswordComplete = await bcrypt.compare(password, user.password);
    if (!isPasswordComplete) {
      throw new UnauthorizedException('Is not correct');
    }
    const clubManagers: number[] | null = user?.ClubMembers.map(
      (clubMember) => clubMember.ClubId,
    );
    return {
      userId: user.id,
      nickname: user.nickname,
      email: user.email,
      clubManagers,
    };
  }

  async getCookieWithAccessToken(payload: any): Promise<CookieTokenDto> {
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

  async setRefreshTokenInDb({ refreshToken, userId }): Promise<void> {
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.redisManager.set(userId.toString(), hashRefreshToken, {
      ttl: Number(process.env.JWT_REFRESH_EXPIRY_TIME),
    });
  }

  async deleteRefreshTokenInDb({ userId }): Promise<void> {
    await this.redisManager.del(userId.toString());
  }

  async getUserIfRefreshTokenMatches({
    refreshToken,
    decodedAccessToken,
  }): Promise<ValidateUserDto | null> {
    const { userId, nickname, email } = decodedAccessToken;
    const currentHashedRefreshToken = await this.redisManager.get(userId);
    if (currentHashedRefreshToken === null)
      throw new UnauthorizedException('refresh token is not in db');

    const isRefreshTokenCorrect = await bcrypt.compare(
      refreshToken,
      currentHashedRefreshToken,
    );
    if (!isRefreshTokenCorrect)
      throw new UnauthorizedException('refresh token is not compare');

    const user = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoin(
        'users.ClubMembers',
        'clubMembers',
        'clubMembers.role = :role',
        {
          role: ClubMembersRoleEnum.Manager,
        },
      )
      .select('users')
      .addSelect('clubMembers.ClubId')
      .where('users.email = :email', { email })
      .getOne();
    const clubManagers: number[] = user?.ClubMembers.map(
      (clubMember) => clubMember.ClubId,
    );

    return {
      userId: user.id,
      nickname: user.nickname,
      email: user.email,
      clubManagers,
    };
  }
}
