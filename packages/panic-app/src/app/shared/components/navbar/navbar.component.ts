import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  username: string;
  emailAddress: string;

  constructor(public router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  logoutUser() {
    this.authService.logout();
  }

  getUserInfo() {
    this.authService.getUser().subscribe((user: any) => {
      this.username = user.username;
      this.emailAddress = user.email;
    });
  }
}
