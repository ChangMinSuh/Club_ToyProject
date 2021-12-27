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
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @Column('enum', {
    enum: ClubMembersRoleEnum,
    name: 'role',
    default: ClubMembersRoleEnum.User,
  })
  role: ClubMembersRoleEnum;

  @IsNotEmpty()
  @IsNumber()
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
