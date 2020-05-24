import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitorsComponent } from './monitors/monitors.component';
import { MonitorComponent } from './monitor/monitor.component';
import { MonitorEditComponent } from './monitor-edit/monitor-edit.component';
import { DowntimeComponent } from './downtime/downtime.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: '',
        component: MonitorsComponent,
      },
      {
        path: 'monitor',
        component: MonitorComponent,
      },
      {
        path: 'monitor/:id',
        component: MonitorEditComponent,
      },
      {
        path: 'downtime/:id',
        component: DowntimeComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
