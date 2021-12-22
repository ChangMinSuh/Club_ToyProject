import { Test, TestingModule } from '@nestjs/testing';
import { ClubPostsService } from './club-posts.service';

describe('ClubPostsService', () => {
  let service: ClubPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubPostsService],
    }).compile();

    service = module.get<ClubPostsService>(ClubPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
