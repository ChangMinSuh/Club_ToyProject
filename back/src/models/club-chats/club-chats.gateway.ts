import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAccessWsGuard } from 'src/auth/guards/jwt-access-ws.guard';
import { ClubChatsService } from './club-chats.service';
import { SetClubChatsDataDto } from './dto/set-clubchats-data.dto';

@WebSocketGateway({
  namespace: /\/clubChat-.+/,
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ClubChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly clubChatsService: ClubChatsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('test')
  handleLogin(@MessageBody() data: string) {
    console.log('test', data);
  }

  @SubscribeMessage('login')
  @UseGuards(JwtAccessWsGuard)
  async loginRoom(
    @MessageBody() { clubMember },
    @ConnectedSocket() socket: Socket,
  ) {
    const namespaceName = socket.nsp.name;

    // 내 채팅 목록
    const myClubChatRoomMembers =
      await this.clubChatsService.findMyClubChatRoomMembersWithRooms(
        clubMember.ClubId,
        clubMember.id,
      );

    // 내 채팅들 집합
    myClubChatRoomMembers.forEach((item) => {
      socket.join(`${namespaceName}-${item?.ClubChatRoomId}`);
    });
    this.server
      .to(socket.id)
      .emit('myClubChatRoomMembers', { myClubChatRoomMembers });
  }

  @SubscribeMessage('chat')
  @UseGuards(JwtAccessWsGuard)
  async sendChat(
    @MessageBody() data: SetClubChatsDataDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const namespaceName = socket.nsp.name;
    const chatData = await this.clubChatsService.setClubChat(data);
    this.server
      .to(`${namespaceName}-${data.ClubChatRoomId}`)
      .emit('chat', chatData);
    return data;
  }

  @SubscribeMessage('exitRoom')
  async exitRoom(
    @MessageBody()
    data: {
      ClubChatRoomId: number;
      ClubMemberId: number;
      loggedInAt: Date;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(data);
    await this.clubChatsService.updateTimeOfClubChatRoomMember(
      data.ClubChatRoomId,
      data.ClubMemberId,
      data.loggedInAt,
    );
  }

  @SubscribeMessage('inviteMember')
  async inviteMember(
    @MessageBody()
    data: {
      roomId: number;
      body: {
        clubMembersId: number[];
      };
    },
    @ConnectedSocket() socket: Socket,
  ) {
    const namespaceName = socket.nsp.name;
    const newClubChatRoomMembers =
      await this.clubChatsService.createClubChatRoomMembers(
        data.roomId,
        data.body.clubMembersId,
      );
    const newClubChatRoomMembersNames = newClubChatRoomMembers.map(
      (member) => member.ClubMember.nickname,
    );
    const chatData = await this.clubChatsService.setClubChat({
      content: `${newClubChatRoomMembersNames.join()}이 추가되었습니다.`,
      ClubChatRoomId: data.roomId,
      isNotice: true,
      ClubMember: null,
    });
    this.server
      .to(`${namespaceName}-${data.roomId}`)
      .emit('newClubChatRoomMembers', {
        newClubChatRoomMembers,
        chatData,
      });
  }

  afterInit(server: Server) {
    console.log('wsServer Init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('connected', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log(socket);
    console.log('disconnected', socket.nsp.name);
  }
}

// 해야할 일
// - 한페이지당 보여지는 채팅 제한. 드래그하면 볼수있게 변경.
