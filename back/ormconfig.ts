import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ClubAppAnswerItems } from './src/models/club-app-answers/entities/club-app-answers-item.entity';
import { ClubAppAnswers } from './src/models/club-app-answers/entities/club-app-answers.entity';
import { ClubAppQuestions } from './src/models/club-app-questions/entities/club-app-questions.entity';
import { ClubChats } from './src/models/club-chats/entities/club-chats';
import { ClubIntroduces } from './src/models/club-introduces/entities/club-introduces.entity';
import { ClubMembers } from './src/models/club-members/entities/club-members.entity';
import { Clubs } from './src/models/clubs/entities/clubs.entity';
import { Users } from './src/models/users/entities/users.entity';

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
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
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  cli: { migrationsDir: 'src/migrations' },
  charset: 'utf8mb4',
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  keepConnectionAlive: true,
};

export = config;
