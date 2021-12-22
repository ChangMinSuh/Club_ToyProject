import {
  CACHE_MANAGER,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Users } from 'src/models/users/entities/users.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';

const mockRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
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
      usersRepository.findOne.mockResolvedValue(undefined);
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
      usersRepository.findOne.mockResolvedValue(user);
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
      usersRepository.findOne.mockResolvedValue(user);

      const result = await service.validateUser(validateUserArgs);

      expect(result).toEqual({
        userId: user.id,
        nickname: user.nickname,
        email: user.email,
      });
    });
  });

  describe('getCookieWithAccessToken', () => {
    const getCookieWithAccessTokenArgs = {
      payload: {
        userId: '7',
        nickname: '123',
        email: 'timssuh@naver.com',
      },
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
      refreshToken: 'refresh_token',
      userId: '7',
    };
    it('should be set refresh token in redis', async () => {
      await service.setRefreshTokenInDb(setRefreshTokenInDbArgs);

      expect(redisManager.set).toHaveBeenCalledTimes(1);
      expect(redisManager.set).toHaveBeenCalledWith(
        setRefreshTokenInDbArgs.userId.toString(),
        expect.any(String),
        expect.any(Object),
      );
    });
  });

  describe('deleteRefreshTokenInDb', () => {
    const deleteRefreshTokenInDbArgs = {
      userId: '7',
    };
    it('should be set refresh token in redis', async () => {
      await service.deleteRefreshTokenInDb(deleteRefreshTokenInDbArgs);

      expect(redisManager.del).toHaveBeenCalledTimes(1);
      expect(redisManager.del).toHaveBeenCalledWith(
        deleteRefreshTokenInDbArgs.userId.toString(),
      );
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

      const result = await service.getUserIfRefreshTokenMatches(
        getUserIfRefreshTokenMatchesArgs,
      );

      expect(redisManager.get).toHaveBeenCalledTimes(1);
      expect(redisManager.get).toHaveBeenCalledWith(expect.any(Number));

      expect(result).toEqual(
        getUserIfRefreshTokenMatchesArgs.decodedAccessToken,
      );
    });
  });
  describe('signUp', () => {
    const signUpArgs = {
      email: 'abc@naver.com',
      password: '123',
      nickname: '신규',
    };

    it('email is exist', async () => {
      const mockGetOne = usersRepository.createQueryBuilder().where().getOne;
      mockGetOne.mockResolvedValue(signUpArgs);

      try {
        await service.signUp(signUpArgs);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('This email exists.');
      }
    });

    it('should be success signUp', async () => {
      const mockGetOne = usersRepository.createQueryBuilder().where().getOne;
      mockGetOne.mockResolvedValue(null);

      await service.signUp(signUpArgs);

      expect(mockGetOne).toHaveBeenCalledTimes(1);

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});
