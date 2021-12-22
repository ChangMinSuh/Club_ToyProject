import { ClubAppQuestionTypeEnum } from '../../club-app-questions/entities/club-app-questions.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Clubs } from '../../clubs/entities/clubs.entity';
import { Users } from '../../users/entities/users.entity';

@Entity({ name: 'club_app_answers' })
export class ClubAppAnswers {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('number', { name: 'clubId' })
  ClubId: number;

  @Column('number', { name: 'userId' })
  UserId: number;

  @Column('varchar', { name: 'question' })
  question: string;

  @Column('boolean', { name: 'isFailed', default: false })
  isFailed?: boolean;

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

  @ManyToOne(() => Users, (user) => user.ClubAppAnswers)
  User: Users;

  @ManyToOne(() => Clubs, (club) => club.ClubAppAnswers)
  Club: Clubs;
}
