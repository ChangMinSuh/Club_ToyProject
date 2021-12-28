import { CoreEntity } from '../../../common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { Clubs } from '../../clubs/entities/clubs.entity';
import { ClubMembers } from '../../club-members/entities/club-members.entity';

@Entity({ name: 'club_posts' })
export class ClubPosts extends CoreEntity {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Column('varchar', { length: 50 })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Column('text')
  content: string;

  @Column('int', { name: 'clubMemberId' })
  ClubMemberId: number;

  @Column('int', { name: 'clubId' })
  ClubId: number;

  @ManyToOne(() => ClubMembers, (clubMember) => clubMember.ClubPosts)
  ClubMember: ClubMembers;

  @ManyToOne(() => Clubs, (club) => club.ClubPosts)
  Club: Clubs;
}
