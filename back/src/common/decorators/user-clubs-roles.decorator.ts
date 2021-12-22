import { SetMetadata } from '@nestjs/common';
import { ClubMembersRoleEnum } from 'src/models/club-members/entities/club-members.entity';

export const USER_CLUBS_ROLES_KEY = 'user_clubs_roles';
export const UserClubsRoles = (...roles: ClubMembersRoleEnum[]) =>
  SetMetadata(USER_CLUBS_ROLES_KEY, roles);
