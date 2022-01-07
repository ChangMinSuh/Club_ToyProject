import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubAppQuestionsService } from './club-app-questions.service';
import {
  ClubAppQuestions,
  ClubAppQuestionTypeEnum,
} from './entities/club-app-questions.entity';

const mockRepository = () => ({
  find: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ClubAppQuestionsService', () => {
  let service: ClubAppQuestionsService;
  let clubAppQuestionsRepository: MockRepository<ClubAppQuestions>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubAppQuestionsService,
        {
          provide: getRepositoryToken(ClubAppQuestions),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<ClubAppQuestionsService>(ClubAppQuestionsService);
    clubAppQuestionsRepository = module.get(
      getRepositoryToken(ClubAppQuestions),
    );
  });

  const clubAppQuestionTmp = {
    id: 1,
    createdAt: '2022-01-06T15:08:21.576Z',
    updatedAt: '2022-01-06T15:08:21.576Z',
    question: '몇살이에요?',
    answer_type: ClubAppQuestionTypeEnum.ShortText,
    ClubId: 2,
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAppQuestion', () => {
    const createAppQuestionArgs = {
      clubId: 2,
      body: {
        question: '하이',
        answer_type: ClubAppQuestionTypeEnum.ShortText,
      },
    };
    it('should be create app question', async () => {
      await service.createAppQuestion(
        createAppQuestionArgs.clubId,
        createAppQuestionArgs.body,
      );
      expect(clubAppQuestionsRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAppQuestions', () => {
    const findAppQuestionsArgs = {
      clubId: 2,
    };
    it('should be find app questions', async () => {
      clubAppQuestionsRepository.find.mockResolvedValue([clubAppQuestionTmp]);
      await service.findAppQuestions(findAppQuestionsArgs.clubId);

      expect(clubAppQuestionsRepository.find).toHaveBeenCalled();
      expect(clubAppQuestionsRepository.find).toHaveBeenCalledWith({
        where: { ClubId: findAppQuestionsArgs.clubId },
      });
    });
  });

  describe('updateAppQuestion', () => {
    const updateAppQuestionArgs = {
      clubId: 2,
      clubAppQuestionId: 1,
      body: {
        question: '몇살이에요??',
        answer_type: ClubAppQuestionTypeEnum.ShortText,
      },
    };
    it('should be update app question', async () => {
      const clubAppQuestionTmpUpdate = {
        ...clubAppQuestionTmp,
      };
      clubAppQuestionTmpUpdate.question = updateAppQuestionArgs.body.question;

      clubAppQuestionsRepository.findOne.mockResolvedValue(clubAppQuestionTmp);
      clubAppQuestionsRepository.save.mockResolvedValue(
        clubAppQuestionTmpUpdate,
      );

      const result = await service.updateAppQuestion(
        updateAppQuestionArgs.clubId,
        updateAppQuestionArgs.clubAppQuestionId,
        updateAppQuestionArgs.body,
      );

      expect(clubAppQuestionsRepository.findOne).toHaveBeenCalled();
      expect(clubAppQuestionsRepository.findOne).toHaveBeenCalledWith({
        id: updateAppQuestionArgs.clubAppQuestionId,
        ClubId: updateAppQuestionArgs.clubId,
      });

      expect(clubAppQuestionsRepository.save).toHaveBeenCalled();
      expect(clubAppQuestionsRepository.save).toHaveBeenCalledWith(
        clubAppQuestionTmpUpdate,
      );

      expect(result).toEqual(clubAppQuestionTmpUpdate);
    });
  });

  describe('removeAppQuestion', () => {
    const removeAppQuestionArgs = {
      clubId: 2,
      clubAppQuestionId: 1,
    };
    it('should be remove app question', async () => {
      clubAppQuestionsRepository.findOne.mockResolvedValue(clubAppQuestionTmp);
      await service.removeAppQuestion(
        removeAppQuestionArgs.clubId,
        removeAppQuestionArgs.clubAppQuestionId,
      );

      expect(clubAppQuestionsRepository.findOne).toHaveBeenCalled();
      expect(clubAppQuestionsRepository.findOne).toHaveBeenCalledWith({
        id: removeAppQuestionArgs.clubAppQuestionId,
        ClubId: removeAppQuestionArgs.clubId,
      });

      expect(clubAppQuestionsRepository.remove).toHaveBeenCalled();
      expect(clubAppQuestionsRepository.remove).toHaveBeenCalled();
    });
  });
});
