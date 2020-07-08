import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private route: Router,
    private toastr: ToastrService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = this.authService.getAccessToken();

    if (this.authService.isLoggedIn !== true) {
      this.route.navigate(['/auth/login']);
      this.toastr.error($localize`Please login to access the dashboard`);
    }
    console.log(this.authService.isTokenExpired(token));
    if (this.authService.isTokenExpired(token)) {
      this.authService.logout();
      this.toastr.warning(
        $localize`You have been automatically logged out for security reasons! To continue the session, please login`
      );
    }

    return true;
  }
}
