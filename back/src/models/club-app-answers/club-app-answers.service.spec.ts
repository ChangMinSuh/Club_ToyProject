import { Test, TestingModule } from '@nestjs/testing';
import { ClubAppAnswersService } from './club-app-answers.service';

describe('ClubAppAnswersService', () => {
  let service: ClubAppAnswersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubAppAnswersService],
    }).compile();

    service = module.get<ClubAppAnswersService>(ClubAppAnswersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
