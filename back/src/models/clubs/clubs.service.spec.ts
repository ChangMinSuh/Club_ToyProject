import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Clubs } from 'src/models/clubs/entities/clubs.entity';
import { Users } from 'src/models/users/entities/users.entity';
import { Connection, Repository } from 'typeorm';
import { ClubAppAnswers } from '../club-app-answers/entities/club-app-answers.entity';
import { ClubChats } from '../club-chats/entities/club-chats';
import { ClubsService } from './clubs.service';

const mockRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn(),
  }),
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
});
const mockConnection = () => ({
  transaction: jest.fn(),
});
const mockCacheManager = () => ({
  get: jest.fn(),
  set: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockConnection = Partial<Record<keyof Connection, jest.Mock>>;
type MockCache = Partial<Record<keyof Cache, jest.Mock>>;

describe('ClubsService', () => {
  let service: ClubsService;
  let redisManager: MockCache;
  let connection: MockConnection;
  let clubsRepository: MockRepository<Clubs>;
  let usersRepository: MockRepository<Users>;
  let clubChatsRepository: MockRepository<ClubChats>;
  let clubAppAnswersRepository: MockRepository<ClubAppAnswers>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubsService,
        { provide: getConnectionToken(), useValue: mockConnection() },
        {
          provide: getRepositoryToken(Clubs),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(ClubChats),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(ClubAppAnswers),
          useValue: mockRepository(),
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager(),
        },
      ],
    }).compile();

    service = module.get<ClubsService>(ClubsService);
    redisManager = module.get('CACHE_MANAGER');
    connection = module.get(getConnectionToken());
    clubsRepository = module.get(getRepositoryToken(Clubs));
    usersRepository = module.get(getRepositoryToken(Users));
    clubChatsRepository = module.get(getRepositoryToken(ClubChats));
    clubAppAnswersRepository = module.get(getRepositoryToken(ClubAppAnswers));
  });

  const ClubTmp = {
    id: 3,
    name: '축구하자',
    explanation: '하하하하',
    createdAt: '2021-11-05T06:02:15.996Z',
    updatedAt: '2021-11-05T06:02:15.996Z',
    Owner: {
      id: 7,
      email: 'timssuh@naver.com',
      nickname: '123',
      createdAt: '2021-11-04T09:33:58.449Z',
      updatedAt: '2021-11-04T09:33:58.449Z',
    },
  };

  const UserTmp = {
    id: 1,
    email: 'timssuh@naver.com',
    password: '123',
    nickname: '생각생각',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createClub', () => {
    const createClubArgs = {
      userId: 1,
      body: {
        name: '축구하자',
        explanation: '풋살도',
        nickname: '생각생각',
      },
    };

    it('club name is exist', async () => {
      clubsRepository.findOne.mockResolvedValue(ClubTmp);
      try {
        await service.createClub(createClubArgs.userId, createClubArgs.body);
        expect(clubsRepository.findOne).toBeUndefined();
      } catch (error) {
        expect(clubsRepository.findOne).toHaveBeenCalled();
        expect(clubsRepository.findOne).toHaveBeenCalledWith({
          name: createClubArgs.body.name,
        });

        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('동아리 이름이 중복됩니다.');
      }
    });

    it('user does not exist', async () => {
      clubsRepository.findOne.mockResolvedValue(undefined);
      usersRepository.findOne.mockResolvedValue(undefined);
      try {
        await service.createClub(createClubArgs.userId, createClubArgs.body);
        expect(usersRepository.findOne).toEqual(UserTmp);
      } catch (error) {
        expect(clubsRepository.findOne).toHaveBeenCalledTimes(1);
        expect(clubsRepository.findOne).toHaveBeenCalledWith({
          name: createClubArgs.body.name,
        });

        expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
        expect(usersRepository.findOne).toHaveBeenCalledWith({
          id: createClubArgs.userId,
        });
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('존재하지 않는 사용자입니다.');
      }
    });

    it('should create club', async () => {
      const mockedManager = {
        getRepository: jest.fn().mockReturnValue({
          save: jest.fn(),
        }),
      };
      clubsRepository.findOne.mockResolvedValue(undefined);
      usersRepository.findOne.mockResolvedValue(UserTmp);
      connection.transaction.mockImplementation((cb) => {
        cb(mockedManager);
      });
      redisManager.get.mockResolvedValue({
        id: 1,
        ClubMembers: [{ name: 'tim' }],
      });

      await service.createClub(createClubArgs.userId, createClubArgs.body);

      expect(clubsRepository.findOne).toHaveBeenCalled();
      expect(clubsRepository.findOne).toHaveBeenCalledWith({
        name: createClubArgs.body.name,
      });

      expect(usersRepository.findOne).toHaveBeenCalled();
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        id: createClubArgs.userId,
      });

      expect(connection.transaction).toHaveBeenCalled();
      expect(mockedManager.getRepository).toHaveBeenCalledTimes(2);

      expect(redisManager.get).toHaveBeenCalled();
      expect(redisManager.set).toHaveBeenCalled();
    });
  });

  describe('findAllClubs', () => {
    it('should find all clubs', async () => {
      clubsRepository.find.mockResolvedValue([ClubTmp]);

      const result = await service.findAllClubs();

      expect(clubsRepository.find).toHaveBeenCalledTimes(1);

      expect(result).toEqual([ClubTmp]);
    });
  });

  describe('findMyClubs', () => {
    const findMyClubsArgs = {
      userId: 7,
    };

    it('should return my clubs', async () => {
      const mockGetMany = clubsRepository
        .createQueryBuilder()
        .leftJoin()
        .where()
        .leftJoinAndSelect().getMany;
      mockGetMany.mockResolvedValue([ClubTmp]);

      const result = await service.findMyClubs(findMyClubsArgs.userId);

      expect(mockGetMany).toHaveBeenCalledTimes(1);

      expect(result).toEqual([ClubTmp]);
    });
  });

  describe('findMyWatingAppAnswers', () => {
    const findMyWatingAppAnswersArgs = {
      userId: 1,
    };

    it('should return myWatingAppAnswers', async () => {
      clubAppAnswersRepository.find.mockResolvedValue({
        ClubId: 3,
        UserId: 1,
        status: 'waiting',
      });

      const result = await service.findMyWatingAppAnswers(
        findMyWatingAppAnswersArgs.userId,
      );

      expect(clubAppAnswersRepository.find).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        ClubId: 3,
        UserId: 1,
        status: 'waiting',
      });
    });
  });

  describe('findOneClub', () => {
    const findOneClubArgs = {
      clubId: 3,
    };
    it('should return a club', async () => {
      clubsRepository.findOne.mockResolvedValue(ClubTmp);
      const result = await service.findOneClub(findOneClubArgs.clubId);

      expect(clubsRepository.findOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(ClubTmp);
    });
  });

  describe('getClubChat', () => {
    const getClubChatArgs = {
      clubId: 3,
    };

    it('club does not exist', async () => {
      clubsRepository.findOne.mockResolvedValue(undefined);
      try {
        await service.getClubChat(getClubChatArgs.clubId);
      } catch (error) {
        expect(clubsRepository.findOne).toHaveBeenCalledTimes(1);

        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('클럽이 존재하지 않습니다.');
      }
    });

    it('should return a club', async () => {
      const clubChats = [
        {
          id: 5,
          content: '테스트',
          createAt: '2021-11-10T04:59:55.609Z',
          UserId: 7,
          User: {
            nickname: '123',
          },
        },
        {
          id: 8,
          content: 'z크크킄',
          createAt: '2021-11-10T05:07:42.064Z',
          UserId: 7,
          User: {
            nickname: '123',
          },
        },
      ];
      clubsRepository.findOne.mockResolvedValue(ClubTmp);
      clubChatsRepository.find.mockResolvedValue(clubChats);

      const result = await service.getClubChat(getClubChatArgs.clubId);
      expect(clubChatsRepository.find).toHaveBeenCalledTimes(1);
      expect(clubChatsRepository.find).toHaveBeenCalledWith({
        where: { ClubId: getClubChatArgs.clubId },
        relations: ['ClubMember'],
      });

      expect(result).toEqual(clubChats);
    });
  });
});
