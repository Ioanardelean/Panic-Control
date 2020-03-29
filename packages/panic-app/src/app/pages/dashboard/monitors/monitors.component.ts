import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/core/services/socket/socket.service';
import { Project } from 'src/app/core/models/monitor';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-monitors',
  templateUrl: './monitors.component.html',
  styleUrls: ['./monitors.component.scss'],
})
export class MonitorsComponent implements OnInit {
  disableSelect = new FormControl(false);

  displayedColumns: string[] = ['status', 'name', 'description', 'url', 'actions'];
  dataSource = new MatTableDataSource<Project>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public monitorService: MonitorService,
    public router: Router,
    private toastr: ToastrService,
    private socketService: SocketService
  ) {
    this.getAll();
  }

  getAll() {
    return this.monitorService.getProjects().subscribe((res: any) => {
      this.dataSource.data = res.data as Project[];
    });
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.socketConnection();
  }
  socketConnection() {
    this.socketService.setupSocketConnection();
    this.socketService.statusMonitor$.subscribe(project => {
      const objIndex = this.dataSource.data.findIndex(obj => obj.id === project.id);
      this.dataSource.data[objIndex] = project;
      this.dataSource.connect().next(this.dataSource.data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteProject(id: any) {
    this.monitorService.deleteProject(id).subscribe(res => {
      this.getAll();
      console.log(res);
      this.toastr.success(res.message);
    });
  }

  startProject(id) {
    this.monitorService.startProject(id).subscribe(res => {
      this.toastr.success(res.message);
    });
  }

  stopProject(id) {
    this.monitorService.stopProject(id).subscribe(res => {
      this.getAll();
      this.toastr.success(res.message);
    });
  }
}
