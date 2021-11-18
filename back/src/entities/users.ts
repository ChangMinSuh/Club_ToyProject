import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Clubs } from './clubs';
import { ClubChats } from './clubChats';

@Index('email', ['email'], { unique: true })
@Entity({ schema: 'sweetipo_nest', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsEmail()
  @IsNotEmpty()
  @Column('varchar', { name: 'email', unique: true, length: 60 })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'nickname', length: 20 })
  nickname: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @OneToMany(() => Clubs, (club) => club.Owner)
  OwnerClubs: Clubs[];

  @OneToMany(() => ClubChats, (clubchat) => clubchat.User)
  ClubChats: ClubChats[];

  @ManyToMany(() => Clubs, (club) => club.Users)
  @JoinTable({
    name: 'user_clubs',
    joinColumn: {
      name: 'UserId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ClubId',
      referencedColumnName: 'id',
    },
  })
  Clubs: Clubs[];
}
