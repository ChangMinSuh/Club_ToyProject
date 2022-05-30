import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ClubMembers,
  ClubMembersRoleEnum,
} from 'src/models/club-members/entities/club-members.entity';
import { CLUB_ROLES_KEY } from '../decorators/clubs-roles.decorator';

@Injectable()
export class ClubRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      ClubMembersRoleEnum[]
    >(CLUB_ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const clubId = Number(request.url.split('/')[3]);
    console.log(request.user, request.url);

    if (isNaN(clubId)) return false;

    const clubMember = request.user?.ClubMembers?.find(
      (clubMember: ClubMembers) => clubMember.ClubId === clubId,
    );
    const userRole = clubMember?.role;
    request.clubMember = clubMember;
    return requiredRoles.some((role) => role === userRole);
  }
}
