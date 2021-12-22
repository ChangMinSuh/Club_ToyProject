import { Test, TestingModule } from '@nestjs/testing';
import { ClubAppQuestionsController } from './club-app-questions.controller';
import { ClubAppQuestionsService } from './club-app-questions.service';

describe('ClubAppQuestionsController', () => {
  let controller: ClubAppQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubAppQuestionsController],
      providers: [ClubAppQuestionsService],
    }).compile();

    controller = module.get<ClubAppQuestionsController>(ClubAppQuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
