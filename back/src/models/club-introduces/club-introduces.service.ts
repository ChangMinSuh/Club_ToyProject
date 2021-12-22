import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClubIntroduceDto } from './dto/create-club-introduce.dto';
import { UpdateClubIntroduceDto } from './dto/update-club-introduce.dto';
import { ClubIntroduces } from './entities/club-introduces.entity';

@Injectable()
export class ClubIntroducesService {
  constructor(
    @InjectRepository(ClubIntroduces)
    private readonly clubIntroducesRepository: Repository<ClubIntroduces>,
  ) {}

  async createIntroduce(clubId: number, body) {
    const clubIntroduces = new ClubIntroduces();
    clubIntroduces.ClubId = clubId;
    clubIntroduces.longExplanation = body.longExplanation;
    await this.clubIntroducesRepository.save(clubIntroduces);
    return 'success';
  }

  async findIntroduce(clubId: number) {
    const result = await this.clubIntroducesRepository.findOne({
      where: { ClubId: clubId },
    });
    return result;
  }

  update(id: number, updateClubIntroduceDto: UpdateClubIntroduceDto) {
    return `This action updates a #${id} clubIntroduce`;
  }

  remove(id: number) {
    return `This action removes a #${id} clubIntroduce`;
  }
}
