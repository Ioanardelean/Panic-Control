import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { User } from 'src/app/core/models/user';
import { TranslateService } from '@ngx-translate/core';
import { TranslateCacheService } from 'ngx-translate-cache';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public isMenuCollapsed = true;

  currentUser: User;
  constructor(public authService: AuthService, public translate: TranslateService, translateCacheService: TranslateCacheService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    translateCacheService.init();


  }
  switchLang(lang: string) {
    this.translate.use(lang);
  }

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
