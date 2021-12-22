import { Test, TestingModule } from '@nestjs/testing';
import { ClubAppQuestionsService } from './club-app-questions.service';

describe('ClubAppQuestionsService', () => {
  let service: ClubAppQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubAppQuestionsService],
    }).compile();

    service = module.get<ClubAppQuestionsService>(ClubAppQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
