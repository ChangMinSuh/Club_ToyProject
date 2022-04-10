import { CACHE_MANAGER, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Users } from 'src/models/users/entities/users.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';

const mockRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  }),
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'jwt token'),
});

const mockRedisManager = () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn(() => '123'),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockCache = Partial<Record<keyof Cache, jest.Mock>>;

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersRepository: MockRepository<Users>;
  let redisManager: MockCache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository(),
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockRedisManager(),
        },
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get(getRepositoryToken(Users));
    redisManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const validateUserArgs = {
      email: 'timssuh@naver.com',
      password: '123',
    };

    it('email is not correct', async () => {
      const mockGetOne = usersRepository
        .createQueryBuilder()
        .select()
        .addSelect()
        .leftJoinAndSelect()
        .where().getOne;
      mockGetOne.mockResolvedValue(undefined);
      try {
        await service.validateUser(validateUserArgs);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Is not correct');
      }
    });

    it('password is not correct', async () => {
      const user = {
        password: 'wrong password',
      };
      const mockGetOne = usersRepository
        .createQueryBuilder()
        .select()
        .addSelect()
        .leftJoinAndSelect()
        .where().getOne;
      mockGetOne.mockResolvedValue(user);
      try {
        await service.validateUser(validateUserArgs);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Is not correct');
      }
    });

    it('should be return user', async () => {
      const user = {
        id: 7,
        email: 'timssuh@naver.com',
        nickname: '123',
        password:
          '$2b$12$Y5bCFj3TuffgF8ip26m86.dK9Vt9FtdXUC0b8SDp/YFWH65uMMVMS',
      };
      const mockGetOne = usersRepository
        .createQueryBuilder()
        .select()
        .addSelect()
        .leftJoinAndSelect()
        .where().getOne;
      mockGetOne.mockResolvedValue(user);

      const result = await service.validateUser(validateUserArgs);

      expect(result).toEqual({
        id: user.id,
        nickname: user.nickname,
        email: user.email,
      });
    });
  });

  describe('getCookieWithAccessToken', () => {
    const getCookieWithAccessTokenArgs = {
      userId: '7',
      nickname: '123',
      email: 'timssuh@naver.com',
    };

    it('should be return access token', async () => {
      const result = await service.getCookieWithAccessToken(
        getCookieWithAccessTokenArgs,
      );
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );

      expect(result).toEqual({
        domain: 'localhost',
        httpOnly: true,
        path: '/',
        token: 'jwt token',
      });
    });
  });

  describe('getCookieWithRefreshToken', () => {
    it('should be return refresh token', async () => {
      const result = await service.getCookieWithRefreshToken();
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );

      expect(result).toEqual({
        domain: 'localhost',
        httpOnly: true,
        path: '/',
        token: 'jwt token',
      });
    });
  });

  describe('setRefreshTokenInDb', () => {
    const setRefreshTokenInDbArgs = {
      userId: 7,
      refreshToken: 'refresh_token',
    };
    it('should be set refresh token in redis', async () => {
      await service.setRefreshTokenInDb(
        setRefreshTokenInDbArgs.refreshToken,
        setRefreshTokenInDbArgs.userId,
      );

      expect(redisManager.set).toHaveBeenCalledTimes(1);
      expect(redisManager.set).toHaveBeenCalledWith(
        `user:refresh:${setRefreshTokenInDbArgs.userId}`,
        expect.any(String),
        expect.any(Object),
      );
    });
  });

  describe('deleteRefreshTokenInDb', () => {
    const deleteRefreshTokenInDbArgs = {
      userId: 7,
    };
    it('should be set refresh token in redis', async () => {
      await service.deleteRefreshTokenInDb(deleteRefreshTokenInDbArgs.userId);

      expect(redisManager.del).toHaveBeenCalledTimes(1);
      expect(redisManager.del).toHaveBeenCalledWith(
        `user:refresh:${deleteRefreshTokenInDbArgs.userId}`,
      );
    });
  });

  describe('setUserInDb', () => {
    const setUserInDbArgs = new Users();
    setUserInDbArgs.id = 1;

    it('should be success setUserInDb', async () => {
      redisManager.set.mockResolvedValue(null);

      await service.setUserInDb(setUserInDbArgs);

      expect(redisManager.set).toHaveBeenCalled();
      expect(redisManager.set).toHaveBeenCalledWith(
        `user:${setUserInDbArgs.id}`,
        setUserInDbArgs,
        expect.any(Object),
      );
    });
  });

  describe('getUserInDb', () => {
    const getUserInDbArgs = {
      userId: 1,
    };

    it('should be get user in db', async () => {
      redisManager.get.mockResolvedValue({
        email: 'timssuh@naver.com',
      });
      const result = await service.getUserInDb(getUserInDbArgs.userId);

      expect(redisManager.get).toHaveBeenCalled();
      expect(redisManager.get).toHaveBeenCalledWith(
        `user:${getUserInDbArgs.userId}`,
      );

      expect(result).toEqual({
        email: 'timssuh@naver.com',
      });
    });
  });

  describe('getUserIfRefreshTokenMatches', () => {
    const getUserIfRefreshTokenMatchesArgs = {
      refreshToken: 'refresh_token',
      decodedAccessToken: {
        userId: 7,
        nickname: '123',
        email: 'timssuh@naver.com',
      },
    };

    it('refresh token is not in db', async () => {
      redisManager.get.mockResolvedValue(null);
      try {
        await service.getUserIfRefreshTokenMatches(
          getUserIfRefreshTokenMatchesArgs,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('refresh token is not in db');
      }
    });

    it('refresh token is not compare', async () => {
      redisManager.get.mockResolvedValue('wrong_token');
      try {
        await service.getUserIfRefreshTokenMatches(
          getUserIfRefreshTokenMatchesArgs,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('refresh token is not compare');
      }
    });

    it('should return user data', async () => {
      redisManager.get.mockResolvedValue(
        '$2b$10$tC2msSkFVeE3w.6nbm9.YefrvapgywLu26zuzF4dFv8BxwEuM1L7O',
      );

      await service.getUserIfRefreshTokenMatches(
        getUserIfRefreshTokenMatchesArgs,
      );

      expect(redisManager.get).toHaveBeenCalledTimes(2);
    });
  });
});
