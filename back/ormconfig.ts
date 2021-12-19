import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ClubIntroduces } from './src/entities/clubIntroduces';
import { ClubChats } from './src/entities/clubChats';
import { Clubs } from './src/entities/clubs';
import { Users } from './src/entities/users';
import { UserClubs } from './src/entities/userClubs';
import { ClubAppQuestionAnswers } from './src/entities/clubAppQuestionAnswers';
import { ClubAppQuestions } from './src/entities/clubAppQuestion';

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
    UserClubs,
    ClubAppQuestionAnswers,
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
