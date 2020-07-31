import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../../config/config';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  apiBaseUrl;

  constructor(
    private httpClient: HttpClient,
    public router: Router,
    public config: Config
  ) {
    this.apiBaseUrl = config.apiBaseUrl;
  }

  getLastEvent(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/history/last`);
  }

  getMonthlyEvents(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiBaseUrl}/history/downtime-month`);
  }

  getDowntimeOnMonitor(id: string): Observable<any> {
    return this.httpClient.get(`${this.apiBaseUrl}/history/${id}/downtime`);
  }
  getYearDowntimeOnMonitor(id: string) {
    return this.httpClient.get(`${this.apiBaseUrl}/history/${id}/downtime-year`);
  }
}
