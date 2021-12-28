import { Clubs } from '../../clubs/entities/clubs.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../../common/entities/core.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { ClubMembers } from '../../club-members/entities/club-members.entity';

@Entity({ name: 'club_chats' })
export class ClubChats extends CoreEntity {
  @IsNotEmpty()
  @IsString()
  @Column('text', { name: 'content' })
  content: string;

  @Column('int', { name: 'clubMemberId', nullable: true })
  ClubMemberId: number | null;

  @Column('int', { name: 'clubId', nullable: true })
  ClubId: number | null;

  @ManyToOne(() => ClubMembers, (clubMember) => clubMember.ClubChats)
  ClubMember: ClubMembers;

  @ManyToOne(() => Clubs, (club) => club.ClubChats)
  Club: Clubs;
}
