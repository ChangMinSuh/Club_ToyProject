import { Module } from '@nestjs/common';
import { ClubAppQuestionsService } from './club-app-questions.service';
import { ClubAppQuestionsController } from './club-app-questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubAppQuestions } from './entities/club-app-questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClubAppQuestions])],
  controllers: [ClubAppQuestionsController],
  providers: [ClubAppQuestionsService],
})
export class ClubAppQuestionsModule {}
