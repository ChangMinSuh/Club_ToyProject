import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Clubs } from '../../clubs/entities/clubs.entity';
import { Users } from '../../users/entities/users.entity';
import { ClubAppAnswerItems } from './club-app-answers-item.entity';
import { CoreEntity } from '../../../common/entities/core.entity';
import { IsString, IsNotEmpty } from 'class-validator';

export enum ClubAppAnswerStatusEnum {
  Waiting = 'waiting',
  Failed = 'failed',
  Passed = 'passed',
}

@Entity({ name: 'club_app_answers' })
export class ClubAppAnswers extends CoreEntity {
  @Column('number', { name: 'clubId' })
  ClubId: number;

  @Column('number', { name: 'userId' })
  UserId: number;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'nickname', length: 20 })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @Column('enum', {
    name: 'status',
    enum: ClubAppAnswerStatusEnum,
    default: ClubAppAnswerStatusEnum.Waiting,
  })
  status: ClubAppAnswerStatusEnum;

  @OneToMany(
    () => ClubAppAnswerItems,
    (clubAppAnswerItems) => clubAppAnswerItems.ClubAppAnswer,
  )
  ClubAppAnswerItems: ClubAppAnswerItems[];

  @ManyToOne(() => Users, (user) => user.ClubAppAnswers)
  User: Users;

  @ManyToOne(() => Clubs, (club) => club.ClubAppAnswers)
  Club: Clubs;
}
