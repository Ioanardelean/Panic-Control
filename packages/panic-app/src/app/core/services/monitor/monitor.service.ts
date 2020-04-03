import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Project } from '../../models/monitor';
import { tap, catchError } from 'rxjs/operators';
import { Config } from '../../config/config';

@Injectable({
  providedIn: 'root',
})
export class MonitorService {
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

  getProjects(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/projects`);
  }

  getCountProjects(): Observable<any> {
    return this.httpClient.get(`${this.apiBaseUrl}/projects/count`);
  }

  getProject(id: string): Observable<any> {
    return this.httpClient.get(`${this.apiBaseUrl}/projects/${id}`);
  }

  addProject(project: Project): Observable<any> {
    return this.httpClient
      .post(`${this.apiBaseUrl}/projects`, project)
      .pipe(catchError(this.handleError));
  }

  updateProject(project: Project, id: string): Observable<any> {
    return this.httpClient
      .put(`${this.apiBaseUrl}/projects/${id}/update`, project)
      .pipe(catchError(this.handleError));
  }

  deleteProject(id: string): Observable<any> {
    return this.httpClient
      .delete(`${this.apiBaseUrl}/projects/${id}/delete`)
      .pipe(catchError(this.handleError));
  }

  startProject(id: string): Observable<any> {
    return this.httpClient
      .post(`${this.apiBaseUrl}/projects/${id}/start`, null)
      .pipe(catchError(this.handleError));
  }

  stopProject(id: string): Observable<any> {
    return this.httpClient
      .post(`${this.apiBaseUrl}/projects/${id}/stop`, null)
      .pipe(catchError(this.handleError));
  }
}
