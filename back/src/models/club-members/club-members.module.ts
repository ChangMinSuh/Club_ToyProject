import { CacheModule, Module } from '@nestjs/common';
import { ClubMembersService } from './club-members.service';
import { ClubMembersController } from './club-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubMembers } from './entities/club-members.entity';
import { ClubAppAnswers } from '../club-app-answers/entities/club-app-answers.entity';
import * as redisStore from 'cache-manager-ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClubMembers, ClubAppAnswers]),
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
  controllers: [ClubMembersController],
  providers: [ClubMembersService],
})
export class ClubMembersModule {}
