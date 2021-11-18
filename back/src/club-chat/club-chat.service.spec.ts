import { Test, TestingModule } from '@nestjs/testing';
import { ClubChatService } from './club-chat.service';

describe('ClubChatService', () => {
  let service: ClubChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubChatService],
    }).compile();

    service = module.get<ClubChatService>(ClubChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
