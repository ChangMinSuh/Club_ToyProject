import { Test, TestingModule } from '@nestjs/testing';
import { ClubChatsController } from './club-chats.controller';

describe('ClubChatsController', () => {
  let controller: ClubChatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubChatsController],
    }).compile();

    controller = module.get<ClubChatsController>(ClubChatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
