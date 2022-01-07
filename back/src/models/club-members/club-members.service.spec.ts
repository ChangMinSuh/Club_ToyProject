import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ClubAppAnswers } from '../club-app-answers/entities/club-app-answers.entity';
import { ClubMembersService } from './club-members.service';
import { ClubMembers } from './entities/club-members.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
});
const mockConnection = () => ({
  transaction: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockConnection = Partial<Record<keyof Connection, jest.Mock>>;

describe('ClubMembersService', () => {
  let service: ClubMembersService;
  let connection: MockConnection;
  let clubMembersRepository: MockRepository<ClubMembers>;
  let clubAppAnswersRepository: MockRepository<ClubAppAnswers>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubMembersService,
        {
          provide: getConnectionToken(),
          useValue: mockConnection(),
        },
        {
          provide: getRepositoryToken(ClubMembers),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(ClubAppAnswers),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<ClubMembersService>(ClubMembersService);
    connection = module.get(getConnectionToken());
    clubMembersRepository = module.get(getRepositoryToken(ClubMembers));
    clubAppAnswersRepository = module.get(getRepositoryToken(ClubAppAnswers));
  });

  const clubMemberTmp = {
    nickname: '생각',
    role: 'manager',
    grade: 0,
    UserId: 1,
    ClubId: 2,
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMemberAndUpdateAppAnswer', () => {
    const createMemberAndUpdateAppAnswerArgs = {
      clubId: 2,
      userId: 1,
      clubAppAnswerId: 2,
      nickname: '생각생각생각',
    };

    it('user is already a club member', async () => {
      clubMembersRepository.findOne.mockResolvedValue({
        id: 1,
      });

      try {
        await service.createMemberAndUpdateAppAnswer(
          createMemberAndUpdateAppAnswerArgs.clubId,
          createMemberAndUpdateAppAnswerArgs.userId,
          createMemberAndUpdateAppAnswerArgs.clubAppAnswerId,
          createMemberAndUpdateAppAnswerArgs.nickname,
        );
        expect(clubAppAnswersRepository.findOne).toHaveBeenCalledTimes(0);
      } catch (error) {
        expect(clubMembersRepository.findOne).toHaveBeenCalled();

        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('이미 가입되어 있는 회원입니다.');
      }
    });

    it('user is already a club member', async () => {
      clubMembersRepository.findOne.mockResolvedValue(undefined);
      clubAppAnswersRepository.findOne.mockResolvedValue(undefined);

      try {
        await service.createMemberAndUpdateAppAnswer(
          createMemberAndUpdateAppAnswerArgs.clubId,
          createMemberAndUpdateAppAnswerArgs.userId,
          createMemberAndUpdateAppAnswerArgs.clubAppAnswerId,
          createMemberAndUpdateAppAnswerArgs.nickname,
        );
        expect(clubAppAnswersRepository.findOne).toHaveBeenCalledTimes(0);
      } catch (error) {
        expect(clubMembersRepository.findOne).toHaveBeenCalled();

        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('db에 존재하지 않습니다.');
      }
    });

    it('should create Member And Update App Answer', async () => {
      const mockedManager = {
        getRepository: jest.fn().mockReturnValue({
          save: jest.fn(),
        }),
      };

      clubMembersRepository.findOne.mockResolvedValue(undefined);
      clubAppAnswersRepository.findOne.mockResolvedValue({
        status: 'waiting',
      });
      connection.transaction.mockImplementation((cb) => {
        cb(mockedManager);
      });

      await service.createMemberAndUpdateAppAnswer(
        createMemberAndUpdateAppAnswerArgs.clubId,
        createMemberAndUpdateAppAnswerArgs.userId,
        createMemberAndUpdateAppAnswerArgs.clubAppAnswerId,
        createMemberAndUpdateAppAnswerArgs.nickname,
      );

      expect(clubMembersRepository.findOne).toHaveBeenCalled();
      expect(clubMembersRepository.findOne).toHaveBeenCalledWith({
        where: {
          UserId: createMemberAndUpdateAppAnswerArgs.userId,
          ClubId: createMemberAndUpdateAppAnswerArgs.clubId,
        },
      });

      expect(clubAppAnswersRepository.findOne).toHaveBeenCalled();
      expect(clubAppAnswersRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: createMemberAndUpdateAppAnswerArgs.clubAppAnswerId,
        },
      });

      expect(connection.transaction).toHaveBeenCalled();
      expect(mockedManager.getRepository().save).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAllMembers', () => {
    const findAllMembersArgs = {
      clubId: 1,
    };

    it('should find all members', async () => {
      clubMembersRepository.find.mockResolvedValue([clubMemberTmp]);
      const result = await service.findAllMembers(findAllMembersArgs.clubId);

      expect(clubMembersRepository.find).toHaveBeenCalled();
      expect(clubMembersRepository.find).toHaveBeenCalledWith({
        where: { ClubId: findAllMembersArgs.clubId },
      });

      expect(result).toEqual([clubMemberTmp]);
    });
  });

  describe('findMember', () => {
    const findMemberArgs = {
      clubMemberId: 1,
    };

    it('should find member', async () => {
      clubMembersRepository.findOne.mockResolvedValue(clubMemberTmp);
      const result = await service.findMember(findMemberArgs.clubMemberId);

      expect(clubMembersRepository.findOne).toHaveBeenCalled();
      expect(clubMembersRepository.findOne).toHaveBeenCalledWith({
        where: { id: findMemberArgs.clubMemberId },
      });

      expect(result).toEqual(clubMemberTmp);
    });
  });
});
