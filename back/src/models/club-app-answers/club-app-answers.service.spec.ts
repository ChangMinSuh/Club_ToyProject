import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ClubAppAnswersService } from './club-app-answers.service';
import {
  ClubAppAnswers,
  ClubAppAnswerStatusEnum,
} from './entities/club-app-answers.entity';

const mockRepository = () => ({
  find: jest.fn(),
});
const mockConnection = () => ({
  transaction: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockConnection = Partial<Record<keyof Connection, jest.Mock>>;

describe('ClubAppAnswersService', () => {
  let service: ClubAppAnswersService;
  let connection: MockConnection;
  let clubAppAnswersRepository: MockRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubAppAnswersService,
        {
          provide: getConnectionToken(),
          useValue: mockConnection(),
        },
        {
          provide: getRepositoryToken(ClubAppAnswers),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<ClubAppAnswersService>(ClubAppAnswersService);
    connection = module.get(getConnectionToken());
    clubAppAnswersRepository = module.get(getRepositoryToken(ClubAppAnswers));
  });
  const clubAppAnswersTmp = {
    id: 3,
    createdAt: '2022-01-04T08:39:04.602Z',
    updatedAt: '2022-01-04T08:46:38.000Z',
    ClubId: 2,
    UserId: 2,
    nickname: '대머리',
    status: 'passed',
    ClubAppAnswerItems: [],
    User: {
      id: 2,
      createdAt: '2022-01-04T07:24:23.207Z',
      updatedAt: '2022-01-04T07:24:23.207Z',
      email: 'tims@naver.com',
      nickname: '123',
    },
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAppAnswer', () => {
    const createAppAnswerArgs = {
      clubId: 2,
      userId: 1,
      body: {
        nickname: '생각생각',
        clubAppAnswerItems: [],
      },
    };
    it('should be create app answer', async () => {
      const mockedManager = {
        getRepository: jest.fn().mockReturnValue({
          save: jest.fn(),
        }),
      };
      connection.transaction.mockImplementation((cb) => {
        cb(mockedManager);
      });

      await service.createAppAnswer(
        createAppAnswerArgs.clubId,
        createAppAnswerArgs.userId,
        createAppAnswerArgs.body,
      );

      expect(connection.transaction).toHaveBeenCalled();
      expect(mockedManager.getRepository().save).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAllAppAnswers', () => {
    const findAllAppAnswersArgs = {
      clubId: 2,
      status: ClubAppAnswerStatusEnum.Waiting,
    };
    it('should be find all app answers', async () => {
      clubAppAnswersRepository.find.mockResolvedValue(clubAppAnswersTmp);

      const result = await service.findAllAppAnswers(
        findAllAppAnswersArgs.clubId,
        findAllAppAnswersArgs.status,
      );

      expect(clubAppAnswersRepository.find).toHaveBeenCalled();

      expect(result).toEqual(clubAppAnswersTmp);
    });
  });
});
