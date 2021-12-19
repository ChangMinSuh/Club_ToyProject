import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserClubsManagerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user, url } = context.switchToHttp().getRequest();
    const clubId = Number(url.split('/')[2]); // /clubs/3/...
    if (url.split('/')[1] !== 'clubs') return false;
    return user.clubManagers.includes(clubId);
  }
}
