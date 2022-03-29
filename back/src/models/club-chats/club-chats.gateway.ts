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
  constructor(private readonly clubChatService: ClubChatsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('test')
  handleLogin(@MessageBody() data: string) {
    console.log('test', data);
  }

  @SubscribeMessage('loginChat')
  @UseGuards(JwtAccessWsGuard)
  async loginRoom(
    @MessageBody() data: { clubChatRooms },
    @ConnectedSocket() socket: Socket,
  ) {
    const namespaceName = socket.nsp.name;
    // 내 채팅들 집합

    data.clubChatRooms.forEach((item) => {
      console.log(namespaceName, item.id);
      socket.join(`${namespaceName}-${item.id}`);
    });
  }

  @SubscribeMessage('chat')
  @UseGuards(JwtAccessWsGuard)
  async sendChat(
    @MessageBody() data: SetClubChatsDataDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const namespaceName = socket.nsp.name;
    const chatData = await this.clubChatService.setClubChat(data);
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
    await this.clubChatService.updateTimeOfClubChatRoomMember(
      data.ClubChatRoomId,
      data.ClubMemberId,
      data.loggedInAt,
    );
  }

  afterInit(server: Server) {
    console.log('wsServer Init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('connected', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected', socket.nsp.name);
  }
}

// 해야할 일
// - 한페이지당 보여지는 채팅 제한. 드래그하면 볼수있게 변경.
