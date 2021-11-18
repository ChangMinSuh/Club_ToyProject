import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ClubChats } from './src/entities/clubChats';
import { Clubs } from './src/entities/clubs';
import { Users } from './src/entities/users';

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Users, Clubs, ClubChats],
  migrations: [__dirname + '/src/migrations/*.ts'],
  cli: { migrationsDir: 'src/migrations' },
  charset: 'utf8mb4',
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  keepConnectionAlive: true,
};

export = config;
