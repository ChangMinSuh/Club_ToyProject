import { Module } from '@nestjs/common';
import { ClubFilesService } from './club-files.service';
import { ClubFilesController } from './club-files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubFiles } from './entities/club-files.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClubFiles])],
  controllers: [ClubFilesController],
  providers: [ClubFilesService],
})
export class ClubMemberFilesModule {}
