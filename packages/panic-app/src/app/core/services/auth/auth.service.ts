import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
import decode from 'jwt-decode';
import { Config } from '../../config/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiBaseUrl;

  constructor(
    private httpClient: HttpClient,
    public router: Router,
    private toastr: ToastrService,
    public config: Config
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
          localStorage.setItem('access_token', data.token);
          if (data.token !== undefined) {
            this.router.navigate(['/dashboard']);
            this.toastr.success(`Welcome, ${user.username}`);
            const tokenPayload = decode(data.token);
            if (tokenPayload.role === 'admin') {
              this.router.navigate(['/admin']);
            }
          } else {
            this.toastr.error(data.error);
          }
        }
      });
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  logout() {
    const removeToken = localStorage.removeItem('access_token');
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

  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.getAccessToken();
      return true;
    }
    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }
  checkUsernameNoTaken(username: string) {
    return this.httpClient.post(`${this.apiBaseUrl}/users/checkUsername`, username);
  }
}
