import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ClubChatsModule } from './models/club-chats/club-chats.module';
import * as ormconfig from '../ormconfig';
import { ClubsModule } from './models/clubs/clubs.module';
import { ClubPostsModule } from './models/club-posts/club-posts.module';
import { ClubAppAnswersModule } from './models/club-app-answers/club-app-answers.module';
import { ClubAppQuestionsModule } from './models/club-app-questions/club-app-questions.module';
import { ClubIntroducesModule } from './models/club-introduces/club-introduces.module';
import { UsersModule } from './models/users/users.module';
import { ClubMembersModule } from './models/club-members/club-members.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SuccessResponseInterceptor } from './common/interceptors/success-response.interceptor';
import { join } from 'path';
import { ClubMemberFilesModule } from './models/club-files/club-files.module';
import { configuration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: process.env.NODE_ENV === 'production' ? [configuration] : [],
      //load: [configuration],
    }),
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    UsersModule,
    ClubsModule,
    ClubChatsModule,
    ClubPostsModule,
    ClubAppAnswersModule,
    ClubAppQuestionsModule,
    ClubIntroducesModule,
    ClubMembersModule,
    ClubMemberFilesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    console.log(__dirname);
    console.log(join(__dirname, '..', 'uploads'));
  }
}
