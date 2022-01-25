import { CacheModule, Module } from '@nestjs/common';
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
import * as redisStore from 'cache-manager-ioredis';

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
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    }),
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
})
export class ClubsModule {}
