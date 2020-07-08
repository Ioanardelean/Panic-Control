import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../../models/monitor';
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

  getProjects(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/projects`);
  }

  getLastEvent(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/history/last`);
  }

  getCountProjectsOnStatus(): Observable<any> {
    return this.httpClient.get(`${this.apiBaseUrl}/projects/count-status`);
  }

  getCountProjects(): Observable<any> {
    return this.httpClient.get(`${this.apiBaseUrl}/projects/count-monitors`);
  }

  getProject(id: string): Observable<any> {
    return this.httpClient.get(`${this.apiBaseUrl}/projects/${id}`);
  }

  addProject(project: Project): Observable<any> {
    return this.httpClient.post(`${this.apiBaseUrl}/projects`, project);
  }

  updateProject(project: Project, id: string): Observable<any> {
    return this.httpClient.put(`${this.apiBaseUrl}/projects/${id}/update`, project);
  }

  deleteProject(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiBaseUrl}/projects/${id}/delete`);
  }

  startProject(id: string): Observable<any> {
    return this.httpClient.post(`${this.apiBaseUrl}/projects/${id}/start`, null);
  }

  stopProject(id: string): Observable<any> {
    return this.httpClient.post(`${this.apiBaseUrl}/projects/${id}/stop`, null);
  }

  getMonthlyEvents(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/history/downtime-month`);
  }
}
