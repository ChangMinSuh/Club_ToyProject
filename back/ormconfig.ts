import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ClubPosts } from './src/models/club-posts/entities/club-posts.entity';
import { ClubAppAnswerItems } from './src/models/club-app-answers/entities/club-app-answers-item.entity';
import { ClubAppAnswers } from './src/models/club-app-answers/entities/club-app-answers.entity';
import { ClubAppQuestions } from './src/models/club-app-questions/entities/club-app-questions.entity';
import { ClubChats } from './src/models/club-chats/entities/club-chats.entity';
import { ClubIntroduces } from './src/models/club-introduces/entities/club-introduces.entity';
import { ClubMembers } from './src/models/club-members/entities/club-members.entity';
import { Clubs } from './src/models/clubs/entities/clubs.entity';
import { Users } from './src/models/users/entities/users.entity';
import * as dotenv from 'dotenv';
import { ClubChatRooms } from './src/models/club-chats/entities/club-chat-rooms.entity';
import { ClubChatRoomMembers } from './src/models/club-chats/entities/club-chat-room-members.entity';

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  cli: { migrationsDir: 'src/migrations' },
  charset: 'utf8mb4',
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  keepConnectionAlive: true,
};

export = config;
