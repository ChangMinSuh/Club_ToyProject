import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Clubs } from '../../clubs/entities/clubs.entity';

export enum ClubAppQuestionTypeEnum {
  ShortText = 'short_text',
  LongText = 'long_text',
  CheckBox = 'check_box',
  RadioButton = 'radio_button',
}

@Entity({ name: 'club_app_questions' })
export class ClubAppQuestions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'question', length: 2000 })
  question: string;

  @Column('enum', {
    name: 'answer_type',
    enum: ClubAppQuestionTypeEnum,
    default: ClubAppQuestionTypeEnum.ShortText,
  })
  answer_type: ClubAppQuestionTypeEnum;

  @Column('number', { name: 'clubId' })
  ClubId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Clubs, (club) => club.ClubAppQuestions)
  Club: Clubs;
}
