import { CoreEntity } from '../../../common/entities/core.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { Clubs } from '../../clubs/entities/clubs.entity';
import { ClubMembers } from '../../club-members/entities/club-members.entity';
@Entity()
export class ClubFiles extends CoreEntity {
  @IsNotEmpty()
  @IsString()
  @Column('varchar')
  filename: string;

  @IsNotEmpty()
  @IsString()
  @Column('varchar')
  url: string;

  @IsNotEmpty()
  @IsBoolean()
  @Column('boolean', { default: true })
  isShow: boolean;

  @Column('int', { name: 'clubId' })
  ClubId: number;

  @Column('int', { name: 'clubMemberId' })
  ClubMemberId: number;

  @ManyToOne(() => Clubs, (club) => club.ClubFiles)
  Club: Clubs;

  @ManyToOne(() => ClubMembers, (clubMember) => clubMember.ClubFiles)
  ClubMember: ClubMembers;
}
