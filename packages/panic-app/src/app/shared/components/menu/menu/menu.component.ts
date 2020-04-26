import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public isMenuCollapsed = true;

  currentUser: User;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    if (this.authService.isLoggedIn) {
      this.authService.getUser().subscribe((user: User) => {
        this.currentUser = user;
      });
    }
  }
}
