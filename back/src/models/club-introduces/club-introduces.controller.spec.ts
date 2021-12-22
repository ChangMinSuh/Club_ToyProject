import { Test, TestingModule } from '@nestjs/testing';
import { ClubIntroducesController } from './club-introduces.controller';
import { ClubIntroducesService } from './club-introduces.service';

describe('ClubIntroducesController', () => {
  let controller: ClubIntroducesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubIntroducesController],
      providers: [ClubIntroducesService],
    }).compile();

    controller = module.get<ClubIntroducesController>(ClubIntroducesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
