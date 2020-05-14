import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Config } from '../../config/config';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  apiBaseUrl;
  constructor(
    private httpClient: HttpClient,
    public router: Router,
    public config: Config
  ) {
    this.apiBaseUrl = config.apiBaseUrl;
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
  getAdminInterface(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.apiBaseUrl}/admin/projects`)
      .pipe(catchError(this.handleError));
  }
  deleteProject(id: string): Observable<any> {
    return this.httpClient
      .delete(`${this.apiBaseUrl}/admin/projects/${id}/delete`)
      .pipe(catchError(this.handleError));
  }
  getUsers(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.apiBaseUrl}/admin/users`)
      .pipe(catchError(this.handleError));
  }
  deleteUser(id: string): Observable<any> {
    return this.httpClient
      .delete(`${this.apiBaseUrl}/admin/users/${id}/delete`)
      .pipe(catchError(this.handleError));
  }
}
