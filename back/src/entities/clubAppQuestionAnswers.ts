import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ClubAppQuestionTypeEnum } from './clubAppQuestion';
import { Clubs } from './clubs';
import { Users } from './users';

@Entity({ schema: 'sweetipo_nest', name: 'club_app_question_answers' })
export class ClubAppQuestionAnswers {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('number', { name: 'clubId' })
  ClubId: number;

  @Column('number', { name: 'userId' })
  UserId: number;

  @Column('varchar', { name: 'question' })
  question: string;

  @Column('boolean', { name: 'isFailed', default: false })
  isFailed: boolean;

  @Column('enum', {
    name: 'answer_type',
    enum: ClubAppQuestionTypeEnum,
    default: ClubAppQuestionTypeEnum.ShortText,
  })
  answer_type: ClubAppQuestionTypeEnum;

  @Column('varchar', { name: 'answer' })
  answer: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.ClubAppQuestionAnswers)
  User: Users;

  @ManyToOne(() => Clubs, (club) => club.ClubAppQuestionAnswers)
  Club: Clubs;
}
