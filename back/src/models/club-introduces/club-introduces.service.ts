import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIntroduceBody } from './dtos/create-introduce.dto';
import { UpdateIntroduceBody } from './dtos/update-introduce.dto';
import { ClubIntroduces } from './entities/club-introduces.entity';

@Injectable()
export class ClubIntroducesService {
  constructor(
    @InjectRepository(ClubIntroduces)
    private readonly clubIntroducesRepository: Repository<ClubIntroduces>,
  ) {}

  async createIntroduce(
    clubId: number,
    body: CreateIntroduceBody,
  ): Promise<void> {
    const clubIntroduces = new ClubIntroduces();
    clubIntroduces.ClubId = clubId;
    clubIntroduces.longExplanation = body.longExplanation;
    await this.clubIntroducesRepository.save(clubIntroduces);
    return;
  }

  async findIntroduce(clubId: number): Promise<ClubIntroduces> {
    const result = await this.clubIntroducesRepository.findOne({
      where: { ClubId: clubId },
    });
    return result;
  }

  async updateIntroduce(
    clubId: number,
    body: UpdateIntroduceBody,
  ): Promise<void> {
    const introduce = await this.clubIntroducesRepository.findOne({
      where: { ClubId: clubId },
    });

    if (!introduce) {
      throw new ConflictException('설명문이 존재하지 않습니다.');
    }

    introduce.longExplanation = body.longExplanation;
    await this.clubIntroducesRepository.save(introduce);
    return;
  }

  async removeIntroduce(clubId: number): Promise<void> {
    const introduce = await this.clubIntroducesRepository.findOne({
      where: { ClubId: clubId },
    });

    if (!introduce) {
      throw new ConflictException('설명문이 존재하지 않습니다.');
    }

    await this.clubIntroducesRepository.remove(introduce);
    return;
  }
}
