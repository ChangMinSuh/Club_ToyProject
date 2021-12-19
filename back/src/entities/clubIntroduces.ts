import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { IsString } from 'class-validator';
import { Clubs } from './clubs';

@Entity({ schema: 'sweetipo_nest', name: 'club_introduces' })
export class ClubIntroduces {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @Column('text', { name: 'longExplanation', nullable: true })
  longExplanation: string;

  @Column('int', { name: 'clubId', nullable: true })
  ClubId: number | null;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToOne(() => Clubs, (club) => club.ClubIntroduce)
  @JoinColumn([{ name: 'clubId', referencedColumnName: 'id' }])
  Club: Clubs;
}
