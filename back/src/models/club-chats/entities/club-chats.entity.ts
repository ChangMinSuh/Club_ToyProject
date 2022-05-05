import { Entity, Column, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../../common/entities/core.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { ClubMembers } from '../../club-members/entities/club-members.entity';
import { ClubChatRooms } from './club-chat-rooms.entity';

@Entity({ name: 'club_chats' })
export class ClubChats extends CoreEntity {
  @IsNotEmpty()
  @IsString()
  @Column('text', { name: 'content' })
  content: string;

  @Column('int', { name: 'clubMemberId', nullable: true })
  ClubMemberId: number | null;

  @Column('boolean', { default: false })
  isNotice: boolean;

  @Column('int', { name: 'clubChatRoomId' })
  ClubChatRoomId: number;

  @ManyToOne(() => ClubMembers, (clubMembers) => clubMembers.ClubChats)
  ClubMember: ClubMembers;

  @ManyToOne(() => ClubChatRooms, (clubChatRoom) => clubChatRoom.ClubChats)
  ClubChatRoom: ClubChatRooms;
}
