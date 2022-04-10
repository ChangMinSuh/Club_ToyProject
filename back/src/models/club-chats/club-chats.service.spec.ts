import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ClubChatsService } from './club-chats.service';
import { ClubChatRoomMembers } from './entities/club-chat-room-members.entity';
import { ClubChatRooms } from './entities/club-chat-rooms.entity';
import { ClubChats } from './entities/club-chats.entity';

const mockRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  count: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});
const mockConnection = () => ({
  transaction: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockConnection = Partial<Record<keyof Connection, jest.Mock>>;

describe('ClubChatsService', () => {
  let service: ClubChatsService;
  let connection: MockConnection;
  let clubChatsRepository: MockRepository<ClubChats>;
  let clubChatRoomsRepository: MockRepository<ClubChatRooms>;
  let clubChatRoomMembersRepository: MockRepository<ClubChatRoomMembers>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubChatsService,
        {
          provide: getConnectionToken(),
          useValue: mockConnection(),
        },
        {
          provide: getRepositoryToken(ClubChats),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(ClubChatRooms),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(ClubChatRoomMembers),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<ClubChatsService>(ClubChatsService);
    connection = module.get(getConnectionToken());
    clubChatsRepository = module.get(getRepositoryToken(ClubChats));
    clubChatRoomsRepository = module.get(getRepositoryToken(ClubChatRooms));
    clubChatRoomMembersRepository = module.get(
      getRepositoryToken(ClubChatRoomMembers),
    );
  });

  const ClubTmp = {
    id: 3,
    name: '축구하자',
    explanation: '하하하하',
    createdAt: '2021-11-05T06:02:15.996Z',
    updatedAt: '2021-11-05T06:02:15.996Z',
    Owner: {
      id: 7,
      email: 'timssuh@naver.com',
      nickname: '123',
      createdAt: '2021-11-04T09:33:58.449Z',
      updatedAt: '2021-11-04T09:33:58.449Z',
    },
  };

  const clubChatsTmp = {
    id: 1,
    content: 'hello',
    ClubMemberId: 1,
    ClubChatRoomId: 1,
    ClubMember: {},
    CLubChatRoom: {},
  };

  const clubChatRoomTmp = {
    id: 1,
    name: '농구',
    explanation: '농구하자',
  };

  const ClubChatRoomMemberTmp = {
    ClubChatRoomId: 1,
    ClubMemberId: 1,
    loggedInAt: null,
  };

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

  describe('findClubChatToSameRoomId', () => {
    const findClubChatToSameRoomIdArgs = {
      roomId: 1,
    };
    it('should be return', async () => {
      clubChatsRepository.find.mockResolvedValue(clubChatsTmp);

      const result = await service.findClubChatToSameRoomId(
        findClubChatToSameRoomIdArgs.roomId,
      );

      expect(clubChatsRepository.find).toHaveBeenCalled();

      expect(result).toEqual(clubChatsTmp);
    });
  });

  describe('findUnreadClubChat', () => {
    const findUnreadClubChatArgs = {
      ClubChatRoomId: 1,
      loggedInAt: new Date() + '',
    };
    it('should be return', async () => {
      clubChatsRepository.count.mockResolvedValue(1);

      const result = await service.findUnreadClubChat(
        findUnreadClubChatArgs.ClubChatRoomId,
        findUnreadClubChatArgs.loggedInAt,
      );

      expect(clubChatsRepository.count).toHaveBeenCalled();

      expect(result).toEqual(1);
    });
  });

  describe('createClubChatRoom', () => {
    const createClubChatRoomArgs = {
      clubId: 1,
      body: {
        name: 'room_name',
        explanation: 'room_explanation',
        clubMemberId: 1,
      },
    };

    it('should be return', async () => {
      const mockedManager = {
        getRepository: jest.fn().mockReturnValue({
          save: jest.fn().mockResolvedValue({ id: 1 }),
        }),
      };

      connection.transaction.mockImplementation((cb) => {
        cb(mockedManager);
      });

      await service.createClubChatRoom(
        createClubChatRoomArgs.clubId,
        createClubChatRoomArgs.body,
      );

      expect(connection.transaction).toHaveBeenCalled();

      expect(mockedManager.getRepository().save).toHaveBeenCalled();
    });
  });

  describe('findClubChatRoomsToSameClubId', () => {
    const findClubChatRoomsToSameClubIdArgs = {
      clubId: 1,
    };

    it('should be return', async () => {
      await service.findClubChatRoomsToSameClubId(
        findClubChatRoomsToSameClubIdArgs.clubId,
      );

      expect(clubChatRoomsRepository.find).toHaveBeenCalled();
    });
  });

  describe('updateClubChatRoom', () => {
    const updateClubChatRoomArgs = {
      roomId: 1,
      body: {
        name: '축구하자',
        explanation: '축구내용',
      },
    };

    it('beforeClubChatRoom is undefined', async () => {
      clubChatRoomsRepository.findOne.mockResolvedValue(clubChatRoomTmp);
      try {
        await service.updateClubChatRoom(
          updateClubChatRoomArgs.roomId,
          updateClubChatRoomArgs.body,
        );
      } catch (error) {
        expect(clubChatRoomsRepository.findOne).toHaveBeenCalledTimes(1);

        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('존재하지 않는 채팅방입니다.');
      }
    });

    it('should be return', async () => {
      clubChatRoomsRepository.findOne.mockResolvedValue(clubChatRoomTmp);
      clubChatRoomsRepository.save.mockResolvedValue({
        id: 1,
        name: updateClubChatRoomArgs.body.name,
        explanation: updateClubChatRoomArgs.body.explanation,
      });
      const result = await service.updateClubChatRoom(
        updateClubChatRoomArgs.roomId,
        updateClubChatRoomArgs.body,
      );
      expect(clubChatRoomsRepository.findOne).toHaveBeenCalledTimes(1);

      expect(clubChatRoomsRepository.save).toHaveBeenCalledTimes(1);

      expect(result).toEqual(clubChatRoomsRepository.save.mock.calls[0][0]);
    });
  });

  describe('removeClubChatRoom', () => {
    const removeClubChatRoomArgs = {
      roomId: 1,
    };
    it('clubChatRoom is undefined', async () => {
      clubChatRoomsRepository.findOne.mockResolvedValue(undefined);
      try {
        await service.removeClubChatRoom(removeClubChatRoomArgs.roomId);
      } catch (error) {
        expect(clubChatRoomsRepository.findOne).toHaveBeenCalledTimes(1);

        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('존재하지 않는 채팅방입니다.');
      }
    });
    it('should be return', async () => {
      clubChatRoomsRepository.findOne.mockResolvedValue(ClubChatRoomMemberTmp);

      await service.removeClubChatRoom(removeClubChatRoomArgs.roomId);

      expect(clubChatRoomsRepository.findOne).toHaveBeenCalledTimes(1);

      expect(clubChatRoomsRepository.remove).toHaveBeenCalledTimes(1);
    });
  });
  describe('findMyClubChatRoomMembersWithRooms', () => {
    const findMyClubChatRoomMembersWithRoomsArgs = {
      roomId: 1,
      clubMemberId: 1,
    };
    it('should be return', async () => {
      clubChatRoomMembersRepository.find.mockResolvedValue(
        ClubChatRoomMemberTmp,
      );

      const result = await service.findMyClubChatRoomMembersWithRooms(
        findMyClubChatRoomMembersWithRoomsArgs.roomId,
        findMyClubChatRoomMembersWithRoomsArgs.clubMemberId,
      );

      expect(clubChatRoomMembersRepository.find).toHaveBeenCalledTimes(1);

      expect(result).toEqual(ClubChatRoomMemberTmp);
    });
  });
  describe('createClubChatRoomMember', () => {
    const createClubChatRoomMemberArgs = {
      roomId: 1,
      clubMemberId: 1,
    };

    it('should be return', async () => {
      await service.createClubChatRoomMember(
        createClubChatRoomMemberArgs.roomId,
        createClubChatRoomMemberArgs.clubMemberId,
      );

      expect(clubChatRoomMembersRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateTimeOfClubChatRoomMember', () => {
    const updateTimeOfClubChatRoomMemberArgs = {
      roomId: 1,
      clubMemberId: 1,
      loggedInAt: new Date(),
    };

    it('beforeClubChatRoom is undefined', async () => {
      clubChatRoomMembersRepository.findOne.mockResolvedValue(clubChatRoomTmp);
      try {
        await service.updateTimeOfClubChatRoomMember(
          updateTimeOfClubChatRoomMemberArgs.roomId,
          updateTimeOfClubChatRoomMemberArgs.clubMemberId,
          updateTimeOfClubChatRoomMemberArgs.loggedInAt,
        );
      } catch (error) {
        expect(clubChatRoomMembersRepository.findOne).toHaveBeenCalledTimes(1);

        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('존재하지 않는 채팅방입니다.');
      }
    });

    it('should be return', async () => {
      clubChatRoomMembersRepository.findOne.mockResolvedValue(
        ClubChatRoomMemberTmp,
      );
      clubChatRoomMembersRepository.save.mockResolvedValue({
        ClubChatRoomId: 1,
        ClubMemberId: 1,
        loggedInAt: updateTimeOfClubChatRoomMemberArgs.loggedInAt,
      });
      const result = await service.updateTimeOfClubChatRoomMember(
        updateTimeOfClubChatRoomMemberArgs.roomId,
        updateTimeOfClubChatRoomMemberArgs.clubMemberId,
        updateTimeOfClubChatRoomMemberArgs.loggedInAt,
      );
      expect(clubChatRoomMembersRepository.findOne).toHaveBeenCalledTimes(1);

      expect(clubChatRoomMembersRepository.save).toHaveBeenCalledTimes(1);

      expect(result).toEqual(
        clubChatRoomMembersRepository.save.mock.calls[0][0],
      );
    });
  });
});
