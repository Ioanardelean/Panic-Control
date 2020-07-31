import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Monitor } from '../../models/monitor';
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

  getMonitors(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/monitors`);
  }

  getLastEvent(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/history/last`);
  }

  getCountMonitorsOnStatus(): Observable<any> {
    return this.httpClient.get(`${this.apiBaseUrl}/monitors/count-status`);
  }

  getCountMonitors(): Observable<any> {
    return this.httpClient.get(`${this.apiBaseUrl}/monitors/count-monitors`);
  }

  getMonitor(id: string): Observable<any> {
    return this.httpClient.get(`${this.apiBaseUrl}/monitors/${id}`);
  }

  addMonitor(monitor: Monitor): Observable<any> {
    return this.httpClient.post(`${this.apiBaseUrl}/monitors`, monitor);
  }

  updateMonitor(monitor: Monitor, id: string): Observable<any> {
    return this.httpClient.put(`${this.apiBaseUrl}/monitors/${id}/update`, monitor);
  }

  deleteMonitor(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiBaseUrl}/monitors/${id}/delete`);
  }

  startMonitor(id: string): Observable<any> {
    return this.httpClient.post(`${this.apiBaseUrl}/monitors/${id}/start`, null);
  }

  stopMonitor(id: string): Observable<any> {
    return this.httpClient.post(`${this.apiBaseUrl}/monitors/${id}/stop`, null);
  }

  getMonthlyEvents(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/history/downtime-month`);
  }
}
