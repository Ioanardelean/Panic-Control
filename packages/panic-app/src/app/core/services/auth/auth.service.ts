import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
import decode from 'jwt-decode';
import { Config } from '../../config/config';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiBaseUrl;

  constructor(
    private httpClient: HttpClient,
    public router: Router,
    private toastr: ToastrService,
    public config: Config,
    public translate: TranslateService,
    private cookieService: CookieService

  ) {
    this.apiBaseUrl = config.apiBaseUrl;
  }

  register(user: User): Observable<any> {
    return this.httpClient.post(`${this.apiBaseUrl}/auth/register`, user);
  }

  login(user: User) {
    return this.httpClient
      .post<any>(`${this.apiBaseUrl}/auth/login`, user)
      .subscribe((data: any) => {
        if (user) {
          this.cookieService.set('access_token', data.token, this.getTokenExpirationDate(data.token), '/', 'localhost', false, 'Lax');

          if (data.token !== undefined) {
            this.router.navigate(['/dashboard']);
            this.toastr.success(this.translate.instant('WELCOME', { value: user.username }));
            const tokenPayload = decode(data.token);
            if (tokenPayload.role === 'admin') {
              this.router.navigate(['/admin']);
            }
          }
        }
      }, (error: any) => {
        this.toastr.error(this.translate.instant('INVALID'));
      });
  }

  getAccessToken() {
    return this.cookieService.get('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = this.getAccessToken();
    return authToken !== '' || null ? true : false;
  }



  logout() {
    const removeToken = this.cookieService.delete('access_token', '/', 'localhost');
    if (removeToken == null) {
      this.router.navigate(['auth/landing']);
    }
  }

  getUser(): Observable<any> {
    return this.httpClient.get(`${this.apiBaseUrl}/users/profile`);
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = decode(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: any): boolean {
    if (!token) {
      token = this.cookieService.check('access_token');
      return true;
    }
    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

}
