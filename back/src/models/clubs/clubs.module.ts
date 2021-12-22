import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubIntroduces } from 'src/models/club-introduces/entities/club-introduces.entity';
import { Clubs } from 'src/models/clubs/entities/clubs.entity';
import { ClubMembers } from 'src/models/club-members/entities/club-members.entity';
import { Users } from 'src/models/users/entities/users.entity';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';
import { ClubChats } from '../club-chats/entities/club-chats';
import { ClubAppQuestions } from '../club-app-questions/entities/club-app-questions.entity';
import { ClubAppAnswers } from '../club-app-answers/entities/club-app-answers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Clubs,
      ClubMembers,
      ClubChats,
      ClubIntroduces,
      ClubAppQuestions,
      ClubAppAnswers,
    ]),
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
})
export class ClubsModule {}
