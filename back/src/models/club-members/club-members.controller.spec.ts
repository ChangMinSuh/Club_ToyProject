import { Test, TestingModule } from '@nestjs/testing';
import { ClubMembersController } from './club-members.controller';
import { ClubMembersService } from './club-members.service';

describe('ClubMembersController', () => {
  let controller: ClubMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubMembersController],
      providers: [ClubMembersService],
    }).compile();

    controller = module.get<ClubMembersController>(ClubMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
