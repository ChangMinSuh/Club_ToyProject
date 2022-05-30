import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ClubAppAnswerItems } from 'src/models/club-app-answers/entities/club-app-answers-item.entity';
import { ClubAppAnswers } from 'src/models/club-app-answers/entities/club-app-answers.entity';
import { ClubAppQuestions } from 'src/models/club-app-questions/entities/club-app-questions.entity';
import { ClubChatRoomMembers } from 'src/models/club-chats/entities/club-chat-room-members.entity';
import { ClubChatRooms } from 'src/models/club-chats/entities/club-chat-rooms.entity';
import { ClubChats } from 'src/models/club-chats/entities/club-chats.entity';
import { ClubFiles } from 'src/models/club-files/entities/club-files.entity';
import { ClubIntroduces } from 'src/models/club-introduces/entities/club-introduces.entity';
import { ClubMembers } from 'src/models/club-members/entities/club-members.entity';
import { ClubPosts } from 'src/models/club-posts/entities/club-posts.entity';
import { Clubs } from 'src/models/clubs/entities/clubs.entity';
import { Users } from 'src/models/users/entities/users.entity';

@Injectable()
export class MySqlConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      port: 3306,
      host: this.configService.get<string>('DB_HOST') || 'localhost',
      database: this.configService.get<string>('DB_DATABASE'),
      // entities: ['dist/**/**/*.entity{.ts,.js}'],
      entities: [
        Users,
        Clubs,
        ClubChats,
        ClubIntroduces,
        ClubMembers,
        ClubAppAnswers,
        ClubAppAnswerItems,
        ClubAppQuestions,
        ClubPosts,
        ClubChatRooms,
        ClubChatRoomMembers,
        ClubFiles,
      ],
      migrations: [__dirname + '/src/migrations/*.ts'],
      cli: { migrationsDir: 'src/migrations' },
      charset: 'utf8mb4',
      synchronize: false,
      logging: process.env.NODE_ENV !== 'production',
      keepConnectionAlive: true,
    };
  }
}
