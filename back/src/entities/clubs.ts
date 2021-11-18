import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { Users } from './users';
import { ClubChats } from './clubChats';

@Index('name', ['name'], { unique: true })
@Entity({ schema: 'sweetipo_nest', name: 'clubs' })
export class Clubs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'name', unique: true, length: 30 })
  name: string;

  @IsString()
  @Column('varchar', { name: 'explanation', length: 100 })
  explanation: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @OneToMany(() => ClubChats, (clubchat) => clubchat.Club)
  ClubChats: ClubChats[];

  @ManyToOne(() => Users, (user) => user.OwnerClubs)
  Owner: Users;

  @ManyToMany(() => Users, (user) => user.Clubs)
  Users: Users[];
}
