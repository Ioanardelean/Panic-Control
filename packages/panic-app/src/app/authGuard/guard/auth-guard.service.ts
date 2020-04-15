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
    const token = localStorage.getItem('access_token');
    if (this.authService.isLoggedIn !== true) {
      this.route.navigate(['/auth/login']);
      this.toastr.error('Please login to access the dashboard');
    }
    if (this.authService.isTokenExpired(token)) {
      this.authService.logout();
      this.toastr.warning('Session Timed Out! Please Login');
    }

    return true;
  }
}
