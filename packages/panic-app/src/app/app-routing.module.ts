import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AuthGuardService } from './authGuard/guard/auth-guard.service';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { RoleGuardService } from './authGuard/roleGuard/role-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/landing',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: ContentLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'admin',
    },
    loadChildren: () =>
      import('./pages/manage-panic/manage.module').then((m) => m.ManageModule),
  },
  {
    path: '',
    redirectTo: 'auth/landing',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
