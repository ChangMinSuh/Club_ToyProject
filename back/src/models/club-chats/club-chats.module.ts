import { Module } from '@nestjs/common';
import { ClubChatsService } from './club-chats.service';
import { ClubChatsGateway } from './club-chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ClubChats } from './entities/club-chats.entity';
import { ClubChatsController } from './club-chats.controller';
import { ClubChatRooms } from './entities/club-chat-rooms.entity';
import { ClubChatRoomMembers } from './entities/club-chat-room-members.entity';
import { ClubMembers } from '../club-members/entities/club-members.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClubChats,
      ClubChatRooms,
      ClubChatRoomMembers,
      ClubMembers,
    ]),
    AuthModule,
  ],
  providers: [ClubChatsGateway, ClubChatsService],
  controllers: [ClubChatsController],
})
export class ClubChatsModule {}
