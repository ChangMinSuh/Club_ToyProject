import { Module } from '@nestjs/common';
import { ClubChatService } from './club-chat.service';
import { ClubChatGateway } from './club-chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubChats } from 'src/entities/clubChats';
import { AuthModule } from 'src/auth/auth.module';
import { Clubs } from 'src/entities/clubs';

@Module({
  imports: [TypeOrmModule.forFeature([ClubChats, Clubs]), AuthModule],
  providers: [ClubChatGateway, ClubChatService],
})
export class ClubChatModule {}
