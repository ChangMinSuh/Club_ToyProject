import { Module } from '@nestjs/common';
import { ClubIntroducesService } from './club-introduces.service';
import { ClubIntroducesController } from './club-introduces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubIntroduces } from './entities/club-introduces.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClubIntroduces])],
  controllers: [ClubIntroducesController],
  providers: [ClubIntroducesService],
})
export class ClubIntroducesModule {}
