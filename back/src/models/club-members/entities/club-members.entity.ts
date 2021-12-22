import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Clubs } from '../../clubs/entities/clubs.entity';
import { Users } from '../../users/entities/users.entity';

export enum ClubMembersRoleEnum {
  User = 'user',
  Manager = 'manager',
}

@Entity({ name: 'club_members' })
export class ClubMembers {
  @Column('int', { primary: true, name: 'userId' })
  UserId: number;

  @Column('int', { primary: true, name: 'clubId' })
  ClubId: number;

  @Column('enum', {
    enum: ClubMembersRoleEnum,
    name: 'role',
    default: ClubMembersRoleEnum.User,
  })
  role: ClubMembersRoleEnum;

  @Column('int', { name: 'grade', default: 0 })
  grade: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Users, (user) => user.ClubChats)
  User: Users;

  @ManyToOne(() => Clubs, (club) => club.ClubChats)
  Club: Clubs;
}
