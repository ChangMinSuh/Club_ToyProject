import { Test, TestingModule } from '@nestjs/testing';
import { ClubIntroducesService } from './club-introduces.service';

describe('ClubIntroducesService', () => {
  let service: ClubIntroducesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubIntroducesService],
    }).compile();

    service = module.get<ClubIntroducesService>(ClubIntroducesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
