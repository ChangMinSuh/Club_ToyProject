import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Clubs } from './clubs';
import { Users } from './users';

@Entity({ schema: 'sweetipo_nest', name: 'clubchats' })
export class ClubChats {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'content' })
  content: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

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
