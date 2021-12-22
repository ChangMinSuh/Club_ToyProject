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
import { Users } from '../../users/entities/users.entity';

import { ClubIntroduces } from '../../club-introduces/entities/club-introduces.entity';
import { ClubMembers } from '../../club-members/entities/club-members.entity';
import { ClubAppAnswers } from '../../club-app-answers/entities/club-app-answers.entity';
import { ClubAppQuestions } from '../../club-app-questions/entities/club-app-questions.entity';
import { ClubChats } from '../../club-chats/entities/club-chats';

@Index('name', ['name'], { unique: true })
@Entity({ name: 'clubs' })
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

  @OneToMany(() => ClubMembers, (clubMember) => clubMember.Club)
  ClubMembers: ClubMembers[];

  @OneToMany(() => ClubChats, (clubchat) => clubchat.Club)
  ClubChats: ClubChats[];

  @OneToMany(() => ClubAppQuestions, (clubAppQuestion) => clubAppQuestion.Club)
  ClubAppQuestions: ClubAppQuestions[];

  @OneToMany(() => ClubAppAnswers, (clubAppAnswers) => clubAppAnswers.Club)
  ClubAppAnswers: ClubAppAnswers[];

  @ManyToOne(() => Users, (user) => user.OwnerClubs)
  Owner: Users;
}
