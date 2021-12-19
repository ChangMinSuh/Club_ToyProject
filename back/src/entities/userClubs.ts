import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Clubs } from './clubs';
import { Users } from './users';

export enum UserClubsRoleEnum {
  User = 'user',
  Manager = 'manager',
}

@Entity({ schema: 'sweetipo_nest', name: 'user_clubs' })
export class UserClubs {
  @Column('int', { primary: true, name: 'userId' })
  UserId: number;

  @Column('int', { primary: true, name: 'clubId' })
  ClubId: number;

  @Column('enum', {
    enum: UserClubsRoleEnum,
    name: 'role',
    default: UserClubsRoleEnum.User,
  })
  role: UserClubsRoleEnum;

  @Column('int', { name: 'grade', default: 0 })
  grade: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToOne(() => Users, (user) => user.ClubChats)
  User: Users;

  @ManyToOne(() => Clubs, (club) => club.ClubChats)
  Club: Clubs;
}
