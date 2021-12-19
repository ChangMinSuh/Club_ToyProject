import { SetMetadata } from '@nestjs/common';
import { UserClubsRoleEnum } from 'src/entities/userClubs';

export const USER_CLUBS_ROLES_KEY = 'user_clubs_roles';
export const UserClubsRoles = (...roles: UserClubsRoleEnum[]) =>
  SetMetadata(USER_CLUBS_ROLES_KEY, roles);
