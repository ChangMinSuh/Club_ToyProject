import { Entity, Column, ManyToOne } from 'typeorm';
import { Clubs } from '../../clubs/entities/clubs.entity';
import { CoreEntity } from '../../../common/entities/core.entity';
import { IsString, IsNotEmpty } from 'class-validator';

export enum ClubAppQuestionTypeEnum {
  ShortText = 'short_text',
  LongText = 'long_text',
  CheckBox = 'check_box',
  RadioButton = 'radio_button',
}

@Entity({ name: 'club_app_questions' })
export class ClubAppQuestions extends CoreEntity {
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'question', length: 2000 })
  question: string;

  @IsString()
  @IsNotEmpty()
  @Column('enum', {
    name: 'answer_type',
    enum: ClubAppQuestionTypeEnum,
    default: ClubAppQuestionTypeEnum.ShortText,
  })
  answer_type: ClubAppQuestionTypeEnum;

  @Column('number', { name: 'clubId' })
  ClubId: number;

  @ManyToOne(() => Clubs, (club) => club.ClubAppQuestions)
  Club: Clubs;
}
