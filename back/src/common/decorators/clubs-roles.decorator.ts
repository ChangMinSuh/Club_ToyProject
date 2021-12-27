import { SetMetadata } from '@nestjs/common';
import { ClubMembersRoleEnum } from 'src/models/club-members/entities/club-members.entity';

export const CLUB_ROLES_KEY = 'club_roles';
export const ClubRoles = (...roles: ClubMembersRoleEnum[]) =>
  SetMetadata(CLUB_ROLES_KEY, roles);
