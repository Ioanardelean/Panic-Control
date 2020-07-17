import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard.routing';
import { CommonModule } from '@angular/common';
import { MonitorEditComponent } from './monitor-edit/monitor-edit.component';
import { MonitorsComponent } from './monitors/monitors.component';
import { MonitorComponent } from './monitor/monitor.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { SocketService } from 'src/app/core/services/socket/socket.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChartsModule } from 'ng2-charts';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DowntimeComponent } from './downtime/downtime.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ProfileComponent } from './profile/profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
@NgModule({
  declarations: [
    MonitorComponent,
    MonitorEditComponent,
    MonitorsComponent,
    DowntimeComponent,
    ProfileComponent,
  ],
  imports: [
    DashboardRoutingModule,
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatCheckboxModule,
    ChartsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    TranslateModule,
    QuillModule.forRoot({
      modules: {
        syntax: true,
        toolbar: [],
      },
    }),
  ],
  exports: [],
  providers: [SocketService],
})
export class DashboardModule {}
