import { ClubMembers } from '../../club-members/entities/club-members.entity';
import { Entity, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ClubChatRooms } from './club-chat-rooms.entity';
import { ClubChats } from './club-chats.entity';

@Entity()
export class ClubChatRoomMembers {
  @Column('int', { primary: true, name: 'clubChatRoomId' })
  ClubChatRoomId: number;

  @Column('int', { primary: true, name: 'clubMemberId' })
  ClubMemberId: number;

  @Column('datetime', { nullable: true })
  loggedInAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => ClubChatRooms,
    (clubChatRoom) => clubChatRoom.ClubChatRoomMembers,
  )
  ClubChatRoom: ClubChatRooms;

  @ManyToOne(
    () => ClubMembers,
    (clubMembers) => clubMembers.ClubChatRoomMembers,
  )
  ClubMember: ClubMembers;
}
