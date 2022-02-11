import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClubMembersRoleEnum } from 'src/models/club-members/entities/club-members.entity';
import { CLUB_ROLES_KEY } from '../decorators/clubs-roles.decorator';

@Injectable()
export class ClubRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      ClubMembersRoleEnum[]
    >(CLUB_ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) return true;

    const { user, url } = context.switchToHttp().getRequest();
    const clubId = Number(url.split('/')[3]);
    console.log(user, url);

    if (isNaN(clubId)) return false;

    const clubMember = user?.ClubMembers?.find(
      (clubMember) => clubMember.ClubId === clubId,
    );
    const userRole = clubMember?.role;
    return requiredRoles.some((role) => role === userRole);
  }
}
