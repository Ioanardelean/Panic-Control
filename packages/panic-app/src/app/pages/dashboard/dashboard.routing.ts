import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitorsComponent } from './monitors/monitors.component';
import { MonitorComponent } from './monitor/monitor.component';
import { MonitorEditComponent } from './monitor-edit/monitor-edit.component';
import { DowntimeComponent } from './downtime/downtime.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'api/dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: MonitorsComponent,
      },
      {
        path: 'monitors',
        component: MonitorComponent,
      },
      {
        path: 'monitors/:id',
        component: MonitorEditComponent,
      },
      {
        path: 'downtime/:id',
        component: DowntimeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
