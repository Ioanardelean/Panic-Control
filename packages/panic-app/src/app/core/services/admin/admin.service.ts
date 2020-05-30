import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Config } from '../../config/config';
import { Observable, of } from 'rxjs';

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

  getAdminInterface(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/admin/projects`);
  }
  deleteProject(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiBaseUrl}/admin/projects/${id}/delete`);
  }
  getUsers(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/admin/users`);
  }
  deleteUser(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiBaseUrl}/admin/users/${id}/delete`);
  }
}
