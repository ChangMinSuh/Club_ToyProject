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
import { ValidateUserDto } from 'src/auth/dto/validate-user';
import { JwtAccessWsGuard } from 'src/auth/guards/jwt-access-ws.guard';
import { UserWs } from 'src/common/decorators/user-ws.decorator';
import { ClubChatService } from './club-chat.service';
import { SetClubChatsDataDto } from './dto/set-clubchats-data.dto';

@WebSocketGateway(80, {
  namespace: /\/clubChat-.+/,
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ClubChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly clubChatService: ClubChatService) {}

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
    @UserWs() { userId, nickname }: ValidateUserDto,
  ) {
    console.log(userId);
    const chatData = await this.clubChatService.setClubChat({
      UserId: userId,
      ...data,
    });
    this.server.emit('chat', { ...chatData, User: { nickname } });
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
