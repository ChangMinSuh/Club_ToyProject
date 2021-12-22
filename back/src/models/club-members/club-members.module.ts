import { Module } from '@nestjs/common';
import { ClubMembersService } from './club-members.service';
import { ClubMembersController } from './club-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubMembers } from './entities/club-members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClubMembers])],
  controllers: [ClubMembersController],
  providers: [ClubMembersService],
})
export class ClubMembersModule {}
