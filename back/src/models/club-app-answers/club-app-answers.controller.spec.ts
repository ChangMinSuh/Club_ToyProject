import { Test, TestingModule } from '@nestjs/testing';
import { ClubAppAnswersController } from './club-app-answers.controller';
import { ClubAppAnswersService } from './club-app-answers.service';

describe('ClubAppAnswersController', () => {
  let controller: ClubAppAnswersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubAppAnswersController],
      providers: [ClubAppAnswersService],
    }).compile();

    controller = module.get<ClubAppAnswersController>(ClubAppAnswersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
