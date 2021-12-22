import { Module } from '@nestjs/common';
import { ClubChatsService } from './club-chats.service';
import { ClubChatsGateway } from './club-chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Clubs } from 'src/models/clubs/entities/clubs.entity';
import { ClubChats } from './entities/club-chats';

@Module({
  imports: [TypeOrmModule.forFeature([ClubChats, Clubs]), AuthModule],
  providers: [ClubChatsGateway, ClubChatsService],
})
export class ClubChatsModule {}
