import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateCacheService } from 'ngx-translate-cache';

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

  constructor(public router: Router, public authService: AuthService, public translate: TranslateService,
    translateCacheService: TranslateCacheService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    translateCacheService.init();
  }

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

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
