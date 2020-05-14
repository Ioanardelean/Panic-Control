import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { User } from 'src/app/core/models/user';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  username: string;
  emailAddress: string;

  admin: string;

  constructor(public router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  logoutUser() {
    this.authService.logout();
  }

  getUserInfo() {
    this.authService.getUser().subscribe((res) => {
      this.username = res.currentUser.username;
      this.emailAddress = res.currentUser.email;
      this.admin = res.currentUser.role;
    });
  }
}
