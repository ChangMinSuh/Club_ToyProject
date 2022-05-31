import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, MoreThan, Repository } from 'typeorm';
import { ClubMembers } from '../club-members/entities/club-members.entity';
import { SetClubChatsDataDto } from './dto/set-clubchats-data.dto';
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
    @InjectRepository(ClubMembers)
    private readonly clubMembersRepository: Repository<ClubMembers>,
    private readonly connection: Connection,
  ) {}

  // club_chats

  async setClubChat(data: SetClubChatsDataDto): Promise<ClubChats> {
    const clubChat = new ClubChats();
    clubChat.content = data.content;
    clubChat.ClubChatRoomId = data.ClubChatRoomId;
    clubChat.ClubMember = data.ClubMember;
    clubChat.isNotice = data.isNotice;
    const result = this.clubChatsRepository.save(clubChat);
    return result;
  }

  async findUnreadClubChat(
    ClubChatRoomId: number,
    loggedInAt: string,
  ): Promise<number> {
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
    clubMemberId: number,
    body: {
      name: string;
      explanation: string;
    },
  ): Promise<ClubChatRooms> {
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
        ClubMemberId: clubMemberId,
      });
    });
    return newClubChatRoom;
  }

  async findClubChatRoom(roomId: number): Promise<ClubChatRooms> {
    return this.clubChatRoomsRepository
      .createQueryBuilder('clubChatRooms')
      .leftJoinAndSelect(
        'clubChatRooms.ClubChatRoomMembers',
        'clubChatRoomMembers',
      )
      .leftJoinAndSelect('clubChatRooms.ClubChats', 'clubChats')
      .leftJoinAndSelect('clubChats.ClubMember', 'ClubMember')
      .where('clubChatRooms.Id = :roomId', { roomId })
      .orderBy('clubChats.createdAt', 'ASC')
      .getOne();
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
  ): Promise<ClubChatRoomMembers[]> {
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

  async createClubChatRoomMembers(
    roomId: number,
    clubMembersId: number[],
  ): Promise<ClubChatRoomMembers[]> {
    const clubMembers = await this.clubMembersRepository.find({
      where: {
        id: clubMembersId,
      },
    });
    const newClubChatRoomMembers = clubMembers.map((clubMember) => {
      const newClubChatRoomMember = new ClubChatRoomMembers();
      newClubChatRoomMember.ClubChatRoomId = roomId;
      newClubChatRoomMember.ClubMember = clubMember;
      return newClubChatRoomMember;
    });

    return this.clubChatRoomMembersRepository.save(newClubChatRoomMembers);
  }

  async updateTimeOfClubChatRoomMember(
    roomId: number,
    clubMemberId: number,
    loggedInAt: Date,
  ): Promise<ClubChatRoomMembers> {
    const beforeClubCharRoomMember =
      await this.clubChatRoomMembersRepository.findOne({
        ClubChatRoomId: roomId,
        ClubMemberId: clubMemberId,
      });
    beforeClubCharRoomMember.loggedInAt = loggedInAt;
    const result = await this.clubChatRoomMembersRepository.save(
      beforeClubCharRoomMember,
    );
    return result;
  }
}
