import { CoreEntity } from '../../../common/entities/core.entity';
import { ClubAppQuestionTypeEnum } from '../../club-app-questions/entities/club-app-questions.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ClubAppAnswers } from './club-app-answers.entity';
import { IsString, IsNotEmpty } from 'class-validator';

@Entity({ name: 'club_app_answer_items' })
export class ClubAppAnswerItems extends CoreEntity {
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'question' })
  question: string;

  @IsString()
  @IsNotEmpty()
  @Column('enum', {
    enum: ClubAppQuestionTypeEnum,
    name: 'answer_type',
  })
  answer_type: ClubAppQuestionTypeEnum;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'answer' })
  answer: string;

  @Column('int', { name: 'clubAppAnswerId' })
  ClubAppAnswerId: number;

  @ManyToOne(
    () => ClubAppAnswers,
    (clubAppAnswers) => clubAppAnswers.ClubAppAnswerItems,
  )
  ClubAppAnswer: ClubAppAnswers;
}
