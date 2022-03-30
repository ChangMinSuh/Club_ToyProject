import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubIntroduces } from 'src/models/club-introduces/entities/club-introduces.entity';
import { Clubs } from 'src/models/clubs/entities/clubs.entity';
import { ClubMembers } from 'src/models/club-members/entities/club-members.entity';
import { Users } from 'src/models/users/entities/users.entity';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';
import { ClubChats } from '../club-chats/entities/club-chats.entity';
import { ClubAppQuestions } from '../club-app-questions/entities/club-app-questions.entity';
import { ClubAppAnswers } from '../club-app-answers/entities/club-app-answers.entity';
import * as redisStore from 'cache-manager-ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [ClubsController],
  providers: [ClubsService],
})
export class ClubsModule {}
