import { Clubs } from '../../clubs/entities/clubs.entity';
import { Users } from '../../users/entities/users.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CoreEntity } from '../../../common/entities/core.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'club_chats' })
export class ClubChats extends CoreEntity {
  @IsNotEmpty()
  @IsString()
  @Column('text', { name: 'content' })
  content: string;

  @Column('int', { name: 'userId', nullable: true })
  UserId: number | null;

  @Column('int', { name: 'clubId', nullable: true })
  ClubId: number | null;

  @ManyToOne(() => Users, (user) => user.ClubChats)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  User: Users;

  @ManyToOne(() => Clubs, (club) => club.ClubChats)
  @JoinColumn([{ name: 'clubId', referencedColumnName: 'id' }])
  Club: Clubs;
}
