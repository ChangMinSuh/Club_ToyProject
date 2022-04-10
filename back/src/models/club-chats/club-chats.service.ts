import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, MoreThan, Repository } from 'typeorm';
import { Clubs } from '../clubs/entities/clubs.entity';
import { ClubChatRoomMembers } from './entities/club-chat-room-members.entity';
import { ClubChatRooms } from './entities/club-chat-rooms.entity';
import { ClubChats } from './entities/club-chats.entity';

@Injectable()
export class ClubChatsService {
  constructor(
    @InjectRepository(ClubChats)
    private readonly clubChatsRepository: Repository<ClubChats>,
    @InjectRepository(ClubChatRooms)
    private readonly clubChatRoomsRepository: Repository<ClubChatRooms>,
    @InjectRepository(ClubChatRoomMembers)
    private readonly clubChatRoomMembersRepository: Repository<ClubChatRoomMembers>,
    private readonly connection: Connection,
  ) {}

  // club_chats

  async setClubChat(data): Promise<ClubChats> {
    const clubChat = new ClubChats();
    clubChat.content = data.content;
    clubChat.ClubChatRoomId = data.ClubChatRoomId;
    clubChat.ClubMember = data.ClubMember;
    const result = this.clubChatsRepository.save(clubChat);
    return result;
  }

  async findClubChatToSameRoomId(roomId: number): Promise<ClubChats[]> {
    return this.clubChatsRepository.find({
      where: { ClubChatRoomId: roomId },
      relations: ['ClubMember', 'ClubMember.ClubChatRoomMembers'],
    });
  }

  async findUnreadClubChat(ClubChatRoomId: number, loggedInAt: string) {
    console.log(loggedInAt);
    return this.clubChatsRepository.count({
      where: {
        ClubChatRoomId: ClubChatRoomId,
        createdAt: MoreThan(new Date(loggedInAt)),
      },
    });
  }

  // club_chat_rooms

  // 채팅방 생성, 생성자를 채팅 멤버로 추가
  async createClubChatRoom(
    clubId: number,
    body: {
      name: string;
      explanation: string;
      clubMemberId: number;
    },
  ): Promise<void> {
    const newClubChatRoom = new ClubChatRooms();
    newClubChatRoom.name = body.name;
    newClubChatRoom.explanation = body.explanation;
    newClubChatRoom.ClubId = clubId;

    await this.connection.transaction(async (manager) => {
      const newRoom = await manager
        .getRepository(ClubChatRooms)
        .save(newClubChatRoom);
      await manager.getRepository(ClubChatRoomMembers).save({
        ClubChatRoomId: newRoom.id,
        ClubMemberId: body.clubMemberId,
      });
    });
    return;
  }

  async findClubChatRoomsToSameClubId(
    clubId: number,
  ): Promise<ClubChatRooms[]> {
    return this.clubChatRoomsRepository.find({
      relations: ['ClubChatRoomMembers', 'ClubChatRoomMembers.ClubMember'],
      where: {
        ClubId: clubId,
      },
    });
  }

  async updateClubChatRoom(
    roomId: number,
    body: {
      name: string;
      explanation: string;
    },
  ): Promise<ClubChatRooms> {
    const beforeClubChatRoom = await this.clubChatRoomsRepository.findOne({
      where: { id: roomId },
    });

    if (!beforeClubChatRoom) {
      throw new ConflictException('존재하지 않는 채팅방입니다.');
    }

    beforeClubChatRoom.name = body.name;
    beforeClubChatRoom.explanation = body.explanation;

    const afterClubChatRoom =
      this.clubChatRoomsRepository.save(beforeClubChatRoom);
    return afterClubChatRoom;
  }

  async removeClubChatRoom(roomId: number): Promise<void> {
    const ClubChatRoom = await this.clubChatRoomsRepository.findOne({
      where: { id: roomId },
    });

    if (!ClubChatRoom) {
      throw new ConflictException('존재하지 않는 채팅방입니다.');
    }

    this.clubChatRoomsRepository.remove(ClubChatRoom);
    return;
  }

  // club_chat_room_member

  async findMyClubChatRoomMembersWithRooms(
    clubId: number,
    clubMemberId: number,
  ) {
    return this.clubChatRoomMembersRepository.find({
      relations: ['ClubChatRoom'],
      where: {
        ClubMemberId: clubMemberId,
        ClubChatRoom: {
          ClubId: clubId,
        },
      },
    });
  }

  async createClubChatRoomMember(
    roomId: number,
    clubMemberId: number,
  ): Promise<void> {
    await this.clubChatRoomMembersRepository.save({
      ClubChatRoomId: roomId,
      ClubMemberId: clubMemberId,
    });
    return;
  }

  async updateTimeOfClubChatRoomMember(
    roomId: number,
    clubMemberId: number,
    loggedInAt: Date,
  ) {
    console.log(roomId, clubMemberId);
    const beforeClubCharRoomMember =
      await this.clubChatRoomMembersRepository.findOne({
        ClubChatRoomId: roomId,
        ClubMemberId: clubMemberId,
      });
    beforeClubCharRoomMember.loggedInAt = loggedInAt;
    const result = await this.clubChatRoomMembersRepository.save(
      beforeClubCharRoomMember,
    );
    console.log(result);
    return result;
  }
}
