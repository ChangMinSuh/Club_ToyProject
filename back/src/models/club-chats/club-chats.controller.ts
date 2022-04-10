import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { ClubMember } from 'src/common/decorators/club-member.decorator';
import { ClubRoles } from 'src/common/decorators/clubs-roles.decorator';
import { ClubRolesGuard } from 'src/common/guards/club-roles.guard';
import {
  ClubMembers,
  ClubMembersRoleEnum,
} from '../club-members/entities/club-members.entity';
import { ClubChatsService } from './club-chats.service';
import { ClubChatRooms } from './entities/club-chat-rooms.entity';

@ApiTags('club_chats')
@ClubRoles(ClubMembersRoleEnum.Manager, ClubMembersRoleEnum.User)
@UseGuards(JwtAccessGuard, ClubRolesGuard)
@Controller('clubs/:clubId/chatrooms')
export class ClubChatsController {
  constructor(private readonly clubChatsService: ClubChatsService) {}

  // club_chat_room_members
  @ApiOperation({ summary: '내 채팅방 가져오기' })
  @Get('members')
  async findMyClubChatRoomMembersWithRooms(
    @Param('clubId', ParseIntPipe) clubId: number,
    @ClubMember() clubMember: ClubMembers,
  ) {
    return this.clubChatsService.findMyClubChatRoomMembersWithRooms(
      clubId,
      clubMember.id,
    );
  }

  @ApiOperation({ summary: '채팅방 멤버 추가' })
  @Post(':roomId/members')
  async createClubChatRoomMember(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body()
    body: {
      clubMemberId: number;
    },
  ): Promise<void> {
    return this.clubChatsService.createClubChatRoomMember(
      roomId,
      body.clubMemberId,
    );
  }

  // club_chat
  @ApiOperation({ summary: '채팅방 채팅 가져오기' })
  @Get(':roomId')
  findClubChatToSameRoomId(@Param('roomId', ParseIntPipe) roomId) {
    return this.clubChatsService.findClubChatToSameRoomId(roomId);
  }

  @ApiOperation({ summary: '읽지 않은 채팅수 가져오기 ' })
  @Get(':roomId/unread')
  findUnreadClubChat(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query('loggedInAt') loggedInAt: string,
  ) {
    return this.clubChatsService.findUnreadClubChat(roomId, loggedInAt);
  }

  // club_chat_rooms
  @ApiOperation({ summary: '채팅방 생성' })
  @Post()
  async createClubChatRoom(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body()
    body: {
      name: string;
      explanation: string;
      clubMemberId: number;
    },
  ): Promise<void> {
    return await this.clubChatsService.createClubChatRoom(clubId, body);
  }

  @ApiOperation({ summary: '전체 채팅방 목록 가져오기' })
  @Get()
  findClubChatRoomsToSameClubId(
    @Param('clubId', ParseIntPipe) clubId: number,
    @ClubMember() clubMember: ClubMembers,
  ): Promise<ClubChatRooms[]> {
    console.log(clubId);
    return this.clubChatsService.findClubChatRoomsToSameClubId(clubId);
  }

  @ApiOperation({ summary: '채팅방 정보 수정' })
  @Patch(':roomId')
  async updateClubChatRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body()
    body: {
      name: string;
      explanation: string;
    },
  ): Promise<ClubChatRooms> {
    return this.clubChatsService.updateClubChatRoom(roomId, body);
  }

  @ApiOperation({ summary: '채팅방 삭제' })
  @Delete(':roomId')
  async removeClubChatRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<void> {
    return this.clubChatsService.removeClubChatRoom(roomId);
  }
}
