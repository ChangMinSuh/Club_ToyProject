import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubChats } from 'src/entities/clubChats';
import { Clubs } from 'src/entities/clubs';
import { Users } from 'src/entities/users';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Clubs, ClubChats])],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
