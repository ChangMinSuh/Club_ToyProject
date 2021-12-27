import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { IsString, IsNotEmpty } from 'class-validator';
import { Clubs } from '../../clubs/entities/clubs.entity';
import { CoreEntity } from '../../../common/entities/core.entity';

@Entity({ name: 'club_introduces' })
export class ClubIntroduces extends CoreEntity {
  @IsString()
  @IsNotEmpty()
  @Column('text', { name: 'longExplanation', nullable: true })
  longExplanation: string;

  @Column('int', { name: 'clubId', nullable: true })
  ClubId: number | null;

  @OneToOne(() => Clubs, (club) => club.ClubIntroduce)
  @JoinColumn([{ name: 'clubId', referencedColumnName: 'id' }])
  Club: Clubs;
}
