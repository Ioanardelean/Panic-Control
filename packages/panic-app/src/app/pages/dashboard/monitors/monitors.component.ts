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
import { CsvDataServiceService } from 'src/app/core/services/history/csv-data-service.service';
import { HistoryService } from 'src/app/core/services/history/history.service';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-monitors',
  templateUrl: './monitors.component.html',
  styleUrls: ['./monitors.component.scss'],
})
export class MonitorsComponent implements OnInit {
  constructor(
    public monitorService: MonitorService,
    public historyService: HistoryService,
    public router: Router,
    private toastr: ToastrService,
    private socketService: SocketService,
    public csvService: CsvDataServiceService
  ) {
    this.getAll();
    this.lastEvent();
    this.downtime = [];
  }
  disableSelect = new FormControl(false);
  displayedColumn: string[] = ['name', 'status', 'startedAt'];
  displayedColumns: string[] = ['status', 'name', 'description', 'url', 'actions'];
  dataSource = new MatTableDataSource<Project>();
  dataSourceEvents = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  stopped: number;
  active: number;
  down: number;
  numItem = 0;
  pageSize = 1;
  downtime: any[];

  lastEventMonitor: string;
  lastEventTime: any;

  getAll() {
    return this.monitorService.getProjects().subscribe((res: any) => {
      this.dataSource.data = res.data as Project[];
      this.dataSource.paginator = this.paginator;
    });
  }
  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.socketConnection();
    this.countProjectStopped();
    this.countProjectActive();
    this.countProjectDown();
    this.latestEvents();
  }
  socketConnection() {
    this.socketService.setupSocketConnection();
    this.socketService.statusMonitor$.subscribe((project) => {
      const objIndex = this.dataSource.data.findIndex((obj) => obj.id === project.id);
      this.dataSource.data[objIndex] = project;
      this.dataSource.connect().next(this.dataSource.data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteProject(id: any) {
    this.monitorService.deleteProject(id).subscribe((res) => {
      this.getAll();
      this.toastr.success(res.message);
    });
  }

  startProject(id) {
    this.monitorService.startProject(id).subscribe((res) => {
      this.getAll();
      this.toastr.success(res.message);
    });
  }

  stopProject(id) {
    this.monitorService.stopProject(id).subscribe((res) => {
      this.getAll();
      this.toastr.success(res.message);
    });
  }

  countProjectStopped() {
    return this.monitorService.getCountProjects().subscribe((res) => {
      this.stopped = res.stopped[1];
    });
  }
  countProjectActive() {
    this.monitorService.getCountProjects().subscribe((res) => {
      this.active = res.active[1];
    });
  }
  countProjectDown() {
    this.monitorService.getCountProjects().subscribe((res) => {
      this.down = res.down[1];
    });
  }
  exportCsv() {
    const data = this.dataSourceEvents.data;
    this.csvService.exportToCsv('events.csv', data);
  }

  lastEvent() {
    this.historyService.getLastEvent().subscribe((res) => {
      if (res.data) {
        const data = res.data;
        this.lastEventMonitor = data.project.name;
        this.lastEventTime = data.startedAt;
      }
    });
  }

  latestEvents() {
    this.historyService.getMonthlyEvents().subscribe((res) => {
      this.dataSourceEvents.data = res.data;
    });
  }
}
