import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Config } from '../../config/config';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket;
  apiBaseUrl;
  statusMonitor$ = new BehaviorSubject(null);

  constructor(public config: Config, public authService: AuthService) {
    this.apiBaseUrl = config.apiBaseUrl;
  }

  setupSocketConnection() {
    this.socket = io(this.apiBaseUrl);
    this.authService.getUser().subscribe((user: any) => {
      this.socket.emit('init', user.id);
      this.socket.on(`projectsUpdate-${user.id}`, data => {
        this.statusMonitor$.next(data);
      });
    });
  }
}
