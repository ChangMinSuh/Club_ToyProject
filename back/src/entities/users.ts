import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Clubs } from './clubs';
import { ClubChats } from './clubChats';
import { UserClubs } from './userClubs';
import { ClubAppQuestionAnswers } from './clubAppQuestionAnswers';

@Index('email', ['email'], { unique: true })
@Entity({ schema: 'sweetipo_nest', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @OneToMany(() => UserClubs, (userclub) => userclub.User)
  UserClubs: UserClubs[];

  @OneToMany(() => Clubs, (club) => club.Owner)
  OwnerClubs: Clubs[];

  @OneToMany(() => ClubChats, (clubchat) => clubchat.User)
  ClubChats: ClubChats[];

  @OneToMany(
    () => ClubAppQuestionAnswers,
    (clubAppQuestionAnswers) => clubAppQuestionAnswers.User,
  )
  ClubAppQuestionAnswers: ClubAppQuestionAnswers[];

  @ManyToMany(() => Clubs, (club) => club.Users)
  @JoinTable({
    name: 'user_clubs',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'clubId',
      referencedColumnName: 'id',
    },
  })
  Clubs: Clubs[];
}
