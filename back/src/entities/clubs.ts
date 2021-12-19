import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { Users } from './users';
import { ClubChats } from './clubChats';
import { ClubIntroduces } from './clubIntroduces';
import { UserClubs } from './userClubs';
import { ClubAppQuestions } from './clubAppQuestion';
import { ClubAppQuestionAnswers } from './clubAppQuestionAnswers';

@Index('name', ['name'], { unique: true })
@Entity({ schema: 'sweetipo_nest', name: 'clubs' })
export class Clubs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'name', unique: true, length: 30 })
  name: string;

  @IsString()
  @Column('varchar', { name: 'explanation', length: 100 })
  explanation: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @OneToOne(() => ClubIntroduces, (clubIntroduce) => clubIntroduce.Club)
  ClubIntroduce: ClubIntroduces;

  @OneToMany(() => UserClubs, (userclub) => userclub.Club)
  UserClubs: UserClubs[];

  @OneToMany(() => ClubChats, (clubchat) => clubchat.Club)
  ClubChats: ClubChats[];

  @OneToMany(() => ClubAppQuestions, (clubAppQuestion) => clubAppQuestion.Club)
  ClubAppQuestions: ClubAppQuestions[];

  @OneToMany(
    () => ClubAppQuestionAnswers,
    (clubAppQuestionAnswers) => clubAppQuestionAnswers.Club,
  )
  ClubAppQuestionAnswers: ClubAppQuestionAnswers[];

  @ManyToOne(() => Users, (user) => user.OwnerClubs)
  Owner: Users;

  @ManyToMany(() => Users, (user) => user.Clubs)
  Users: Users[];
}
