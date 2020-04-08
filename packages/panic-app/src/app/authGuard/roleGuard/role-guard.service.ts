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
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('access_token');
    // decode the token to get its payload
    const tokenPayload = decode(token);
    if (!this.auth.isLoggedIn || tokenPayload.role !== expectedRole) {
      this.router.navigate(['api/dashboard']);
      return false;
    }
    return true;
  }
}
