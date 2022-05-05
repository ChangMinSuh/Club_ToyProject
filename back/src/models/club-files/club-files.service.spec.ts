import { Test, TestingModule } from '@nestjs/testing';
import { ClubFilesService } from './club-files.service';

describe('ClubFilesService', () => {
  let service: ClubFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubFilesService],
    }).compile();

    service = module.get<ClubFilesService>(ClubFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
