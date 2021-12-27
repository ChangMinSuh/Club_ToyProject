import { Module } from '@nestjs/common';
import { ClubMembersService } from './club-members.service';
import { ClubMembersController } from './club-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubMembers } from './entities/club-members.entity';
import { ClubAppAnswers } from '../club-app-answers/entities/club-app-answers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClubMembers, ClubAppAnswers])],
  controllers: [ClubMembersController],
  providers: [ClubMembersService],
})
export class ClubMembersModule {}
