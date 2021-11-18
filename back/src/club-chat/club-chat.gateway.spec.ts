import { Test, TestingModule } from '@nestjs/testing';
import { ClubChatGateway } from './club-chat.gateway';
import { ClubChatService } from './club-chat.service';

describe('ClubChatGateway', () => {
  let gateway: ClubChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubChatGateway, ClubChatService],
    }).compile();

    gateway = module.get<ClubChatGateway>(ClubChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
