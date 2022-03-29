import { CoreEntity } from '../../../common/entities/core.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { Clubs } from '../../clubs/entities/clubs.entity';
import { ClubChats } from './club-chats.entity';
import { ClubChatRoomMembers } from './club-chat-room-members.entity';

@Entity({ name: 'club_chat_rooms' })
export class ClubChatRooms extends CoreEntity {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Column('varchar', { length: 20 })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Column('varchar', { length: 50 })
  explanation: string;

  @Column('int', { name: 'clubId' })
  ClubId: number;

  @OneToMany(() => ClubChats, (clubChat) => clubChat.ClubChatRoom)
  ClubChats: ClubChats[];

  @OneToMany(
    () => ClubChatRoomMembers,
    (clubChatRoomMember) => clubChatRoomMember.ClubChatRoom,
  )
  ClubChatRoomMembers: ClubChatRoomMembers[];

  @ManyToOne(() => Clubs, (club) => club.ClubChatRooms)
  Club: Clubs;
}
