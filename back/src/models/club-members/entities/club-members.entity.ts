import {
  Entity,
  Column,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Clubs } from '../../clubs/entities/clubs.entity';
import { Users } from '../../users/entities/users.entity';
import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';
import { CoreEntity } from '../../../common/entities/core.entity';
import { ClubPosts } from '../../club-posts/entities/club-posts.entity';
import { ClubChatRoomMembers } from '../../club-chats/entities/club-chat-room-members.entity';
import { ClubFiles } from '../../club-files/entities/club-files.entity';
import { ClubChats } from '../../club-chats/entities/club-chats.entity';

export enum ClubMembersRoleEnum {
  User = 'user',
  Manager = 'manager',
}

@Entity({ name: 'club_members' })
export class ClubMembers extends CoreEntity {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Column('varchar', { name: 'nickname', length: 20 })
  nickname: string;

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

  @Column('int', { name: 'userId' })
  UserId: number;

  @Column('int', { name: 'clubId' })
  ClubId: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => ClubPosts, (clubPost) => clubPost.ClubMember)
  ClubPosts: ClubPosts[];

  @OneToMany(() => ClubChats, (clubChat) => clubChat.ClubMember)
  ClubChats: ClubChats[];

  @OneToMany(
    () => ClubChatRoomMembers,
    (clubChatRoomMember) => clubChatRoomMember.ClubMember,
  )
  ClubChatRoomMembers: ClubChatRoomMembers[];

  @OneToMany(() => ClubFiles, (clubFiles) => clubFiles.ClubMember)
  ClubFiles: ClubFiles[];

  @ManyToOne(() => Users, (user) => user.ClubMembers)
  User: Users;

  @ManyToOne(() => Clubs, (club) => club.ClubMembers)
  Club: Clubs;
}
