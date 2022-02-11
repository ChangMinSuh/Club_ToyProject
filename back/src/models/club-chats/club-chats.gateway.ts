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

  @SubscribeMessage('chat')
  @UseGuards(JwtAccessWsGuard)
  async sendChat(
    @MessageBody() data: SetClubChatsDataDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chatData = await this.clubChatService.setClubChat(data);
    this.server.emit('chat', chatData);
    return data;
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
