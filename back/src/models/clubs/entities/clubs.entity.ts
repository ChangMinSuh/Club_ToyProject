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
import { CoreEntity } from '../../../common/entities/core.entity';
import { ClubPosts } from '../../club-posts/entities/club-posts.entity';

@Index('name', ['name'], { unique: true })
@Entity({ name: 'clubs' })
export class Clubs extends CoreEntity {
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'name', unique: true, length: 30 })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'explanation', length: 100 })
  explanation: string;

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

  @OneToMany(() => ClubPosts, (clubPost) => clubPost.Club)
  ClubPosts: ClubPosts[];

  @ManyToOne(() => Users, (user) => user.OwnerClubs)
  Owner: Users;
}
