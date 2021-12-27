import { Entity, Column, DeleteDateColumn, Index, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Clubs } from '../../clubs/entities/clubs.entity';
import { ClubChats } from '../../club-chats/entities/club-chats';
import { ClubMembers } from '../../club-members/entities/club-members.entity';
import { ClubAppAnswers } from '../../club-app-answers/entities/club-app-answers.entity';
import { CoreEntity } from '../../../common/entities/core.entity';

@Index('email', ['email'], { unique: true })
@Entity({ name: 'users' })
export class Users extends CoreEntity {
  @IsEmail()
  @IsNotEmpty()
  @Column('varchar', { name: 'email', unique: true, length: 60 })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'nickname', length: 20 })
  nickname: string;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @OneToMany(() => ClubMembers, (clubMembers) => clubMembers.User)
  ClubMembers: ClubMembers[];

  @OneToMany(() => Clubs, (club) => club.Owner)
  OwnerClubs: Clubs[];

  @OneToMany(() => ClubChats, (clubchat) => clubchat.User)
  ClubChats: ClubChats[];

  @OneToMany(() => ClubAppAnswers, (ClubAppAnswers) => ClubAppAnswers.User)
  ClubAppAnswers: ClubAppAnswers[];
}
