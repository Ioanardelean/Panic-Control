import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {
  constructor(public router: Router, private authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const expectedRole = route.data.expectedRole;
    const token = this.authService.getAccessToken();
    const user = decode(token);
    if (!this.authService.isLoggedIn || user.role !== expectedRole) {
      this.router.navigate(['/dashboard/']);
      return false;
    }

    return true;
  }
}
