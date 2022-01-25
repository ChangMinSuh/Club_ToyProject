import { CacheModule, Module } from '@nestjs/common';
import { ClubMembersService } from './club-members.service';
import { ClubMembersController } from './club-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubMembers } from './entities/club-members.entity';
import { ClubAppAnswers } from '../club-app-answers/entities/club-app-answers.entity';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClubMembers, ClubAppAnswers]),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    }),
  ],
  controllers: [ClubMembersController],
  providers: [ClubMembersService],
})
export class ClubMembersModule {}
