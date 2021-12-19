import { UserClubsManagerGuard } from './user-clubs.guard';

describe('UserClubsGuard', () => {
  it('should be defined', () => {
    expect(new UserClubsManagerGuard()).toBeDefined();
  });
});
