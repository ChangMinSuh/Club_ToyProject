import { Module } from '@nestjs/common';
import { ClubAppAnswersService } from './club-app-answers.service';
import { ClubAppAnswersController } from './club-app-answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubAppAnswers } from './entities/club-app-answers.entity';
import { ClubAppQuestions } from '../club-app-questions/entities/club-app-questions.entity';
import { Users } from '../users/entities/users.entity';
import { Clubs } from '../clubs/entities/clubs.entity';
import { ClubAppAnswerItems } from './entities/club-app-answers-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClubAppAnswers,
      ClubAppAnswerItems,
      ClubAppQuestions,
      Users,
      Clubs,
    ]),
  ],
  controllers: [ClubAppAnswersController],
  providers: [ClubAppAnswersService],
})
export class ClubAppAnswersModule {}
