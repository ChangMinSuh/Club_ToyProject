import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubAppQuestions } from 'src/entities/clubAppQuestion';
import { ClubAppQuestionAnswers } from 'src/entities/clubAppQuestionAnswers';
import { ClubChats } from 'src/entities/clubChats';
import { ClubIntroduces } from 'src/entities/clubIntroduces';
import { Clubs } from 'src/entities/clubs';
import { UserClubs } from 'src/entities/userClubs';
import { Users } from 'src/entities/users';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Clubs,
      UserClubs,
      ClubChats,
      ClubIntroduces,
      ClubAppQuestions,
      ClubAppQuestionAnswers,
    ]),
  ],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
