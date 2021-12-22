import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Clubs } from 'src/models/clubs/entities/clubs.entity';
import { Users } from 'src/models/users/entities/users.entity';
import { Repository } from 'typeorm';
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
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ClubsService', () => {
  let service: ClubsService;
  let clubsRepository: MockRepository<Clubs>;
  let usersRepository: MockRepository<Users>;
  let clubChatsRepository: MockRepository<ClubChats>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubsService,
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
      ],
    }).compile();

    service = module.get<ClubsService>(ClubsService);
    clubsRepository = module.get(getRepositoryToken(Clubs));
    usersRepository = module.get(getRepositoryToken(Users));
    clubChatsRepository = module.get(getRepositoryToken(ClubChats));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllClubs', () => {
    it('should find all clubs', async () => {
      const allClubs = [
        {
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
        },
      ];
      const mockGetMany = clubsRepository
        .createQueryBuilder()
        .leftJoinAndSelect().getMany;
      mockGetMany.mockResolvedValue(allClubs);
      const result = await service.findAllClubs();
      expect(mockGetMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(allClubs);
    });
  });

  describe('findMyClubs', () => {
    const findMyClubsArgs = {
      userId: 7,
    };

    it('should return my clubs', async () => {
      const allClubs = [
        {
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
        },
      ];
      const mockGetMany = clubsRepository
        .createQueryBuilder()
        .leftJoin()
        .where()
        .leftJoinAndSelect().getMany;
      mockGetMany.mockResolvedValue(allClubs);

      const result = await service.findMyClubs(findMyClubsArgs);

      expect(mockGetMany).toHaveBeenCalledTimes(1);

      expect(result).toEqual(allClubs);
    });
  });

  describe('setClub', () => {
    const setClubArgs = {
      userId: 7,
      body: {
        name: '배구하자',
        explanation: '하키하키하',
      },
    };

    it('The club name overlaps', async () => {
      clubsRepository.findOne.mockResolvedValue(setClubArgs);
      try {
        await service.setClub(setClubArgs.userId, setClubArgs.body);
      } catch (error) {
        expect(clubsRepository.findOne).toHaveBeenCalledTimes(1);
        expect(clubsRepository.findOne).toHaveBeenCalledWith({
          name: setClubArgs.body.name,
        });

        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('동아리 이름이 중복됩니다.');
      }
    });

    it('user does not exist', async () => {
      clubsRepository.findOne.mockResolvedValue(undefined);
      usersRepository.findOne.mockResolvedValue({ userId: 7 });
      try {
        await service.setClub(setClubArgs.userId, setClubArgs.body);
      } catch (error) {
        expect(clubsRepository.findOne).toHaveBeenCalledTimes(1);
        expect(clubsRepository.findOne).toHaveBeenCalledWith({
          name: setClubArgs.body.name,
        });

        expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
        expect(usersRepository.findOne).toHaveBeenCalledWith(
          expect.any(Object),
        );

        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('존재하지 않는 사용자입니다.');
      }
    });

    it('should return a club', async () => {
      clubsRepository.findOne.mockResolvedValue(undefined);
      usersRepository.findOne.mockResolvedValue({ userId: 7 });
      clubsRepository.save.mockResolvedValue(setClubArgs);

      const result = await service.setClub(
        setClubArgs.userId,
        setClubArgs.body,
      );

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        id: setClubArgs.userId,
      });

      expect(clubsRepository.save).toHaveBeenCalledTimes(1);
      expect(clubsRepository.save).toHaveBeenCalledWith(expect.any(Object));

      expect(result).toBe('success');
    });
  });

  describe('findOneClub', () => {
    const findOneClubArgs = {
      clubId: 3,
      userId: 7,
    };

    it('not part of the club', async () => {
      const mockGetOne = clubsRepository
        .createQueryBuilder()
        .innerJoin()
        .where()
        .andWhere().getOne;
      mockGetOne.mockResolvedValue(undefined);
      try {
        service.findOneClub(findOneClubArgs);
      } catch (error) {
        expect(mockGetOne).toHaveBeenCalledTimes(1);

        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('동아리에 가입되지 않았습니다.');
      }
    });

    it('should return a club', async () => {
      const oneClub = {
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
      const mockGetOne = clubsRepository
        .createQueryBuilder()
        .innerJoin()
        .where()
        .andWhere().getOne;
      mockGetOne.mockResolvedValue(oneClub);

      const result = await service.findOneClub(findOneClubArgs);

      expect(mockGetOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(oneClub);
    });
  });

  describe('getClubChat', () => {
    const getClubChatArgs = {
      clubId: 3,
    };

    it('club does not exist', async () => {
      clubsRepository.findOne.mockResolvedValue(undefined);
      try {
        await service.getClubChat(getClubChatArgs);
      } catch (error) {
        expect(clubsRepository.findOne).toHaveBeenCalledTimes(1);

        expect(error).toBeInstanceOf(UnauthorizedException);
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
      const mockGetMeny = clubChatsRepository
        .createQueryBuilder()
        .leftJoin()
        .select()
        .addSelect()
        .where().getMany;

      clubsRepository.findOne.mockResolvedValue({ id: 1 });
      mockGetMeny.mockResolvedValue(clubChats);

      const result = await service.getClubChat(getClubChatArgs);

      expect(clubsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(clubsRepository.findOne).toHaveBeenCalledWith({
        name: '축구하자',
      });

      expect(mockGetMeny).toHaveBeenCalledTimes(1);

      expect(result).toEqual(clubChats);
    });
  });
});
