import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AuthModule } from './pages/auth/auth.module';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { AuthInterceptor } from './core/services/auth/auth.intercepteur';
import { Config } from './core/config/config';
import { CustomConfig } from './core/config/customConfig';
import { MatMenuModule } from '@angular/material/menu';
import { MenuComponent } from './shared/components/menu/menu/menu.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { ErrorIntercept } from './core/services/error.interceptor';
import { TranslateCacheModule, TranslateCacheSettings, TranslateCacheService } from 'ngx-translate-cache';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
export function TranslateCacheFactory(translateService, translateCacheSettings) {
  return new TranslateCacheService(translateService, translateCacheSettings);
}
@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    AuthLayoutComponent,
    FooterComponent,
    NavbarComponent,
    MenuComponent,
    AdminLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    AuthModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule.forRoot(),
    TranslateCacheModule.forRoot({
      cacheService: {
        provide: TranslateCacheService,
        useFactory: (translateService, translateCacheSettings) => {
          return new TranslateCacheService(translateService, translateCacheSettings)
        },
        deps: [TranslateService, TranslateCacheSettings]
      },
      cacheName: 'lang',
      cacheMechanism: 'Cookie',
      cookieExpiry: 1,
    })
  ],
  providers: [
    {
      provide: Config,
      useClass: CustomConfig,
    },
    {
      provide: TranslateLoader,
      useFactory: httpTranslateLoader,
      deps: [HttpClient]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorIntercept,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
