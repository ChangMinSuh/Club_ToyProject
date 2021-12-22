import { Test, TestingModule } from '@nestjs/testing';
import { ClubPostsController } from './club-posts.controller';
import { ClubPostsService } from './club-posts.service';

describe('ClubPostsController', () => {
  let controller: ClubPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubPostsController],
      providers: [ClubPostsService],
    }).compile();

    controller = module.get<ClubPostsController>(ClubPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
