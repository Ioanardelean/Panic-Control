import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SocketService } from 'src/app/core/services/socket/socket.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ManagePanicComponent } from './manage-panic.component';
import { ManageRoutingModule } from './manage.routing';
@NgModule({
  declarations: [ManagePanicComponent],
  imports: [
    ManageRoutingModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  exports: [],
  providers: [SocketService],
})
export class ManageModule {}
