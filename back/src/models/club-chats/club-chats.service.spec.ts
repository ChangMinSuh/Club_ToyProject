import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubChatsService } from './club-chats.service';
import { ClubChats } from './entities/club-chats.entity';

const mockRepository = () => ({
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ClubChatsService', () => {
  let service: ClubChatsService;
  let clubChatsRepository: MockRepository<ClubChats>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubChatsService,
        {
          provide: getRepositoryToken(ClubChats),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<ClubChatsService>(ClubChatsService);
    clubChatsRepository = module.get(getRepositoryToken(ClubChats));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setClubChat', () => {
    const setClubChatArgs = {
      content: '하이',
      UserId: 7,
      ClubId: 2,
      clubName: '축구하자',
    };

    it('should be return', async () => {
      const saveArgs = {
        id: 1,
        content: setClubChatArgs.content,
        UserId: setClubChatArgs.UserId,
        createAt: Date.now(),
      };
      clubChatsRepository.save.mockResolvedValue(saveArgs);

      const result = await service.setClubChat(setClubChatArgs);

      expect(clubChatsRepository.save).toHaveBeenCalledTimes(1);
      expect(clubChatsRepository.save).toHaveBeenCalledWith(expect.any(Object));

      expect(result).toEqual(saveArgs);
    });
  });
});
