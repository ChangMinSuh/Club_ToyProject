import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<Users>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const UserTmp = {
    id: 1,
    email: 'timssuh@naver.com',
    password: '123',
    nickname: '생각생각',
  };

  describe('createUser', () => {
    const createArgs = {
      body: {
        email: 'timssuh@naver.com',
        password: '123',
        nickname: '생각생각',
      },
    };
    it('email exist', async () => {
      usersRepository.findOne.mockResolvedValue(UserTmp);
      try {
        await service.createUser(createArgs.body);
      } catch (error) {
        expect(usersRepository.findOne).toHaveBeenCalled();
        expect(usersRepository.findOne).toHaveBeenCalledWith({
          email: createArgs.body.email,
        });

        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('This email exists.');
      }
    });

    it('should create user', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);

      await service.createUser(createArgs.body);

      expect(usersRepository.findOne).toHaveBeenCalled();
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        email: createArgs.body.email,
      });

      expect(usersRepository.save).toHaveBeenCalled();
    });
  });
});
