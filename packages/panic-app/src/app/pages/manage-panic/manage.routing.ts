import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePanicComponent } from './manage-panic.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: '',
        component: ManagePanicComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRoutingModule {}
