import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/core/services/socket/socket.service';
import { Monitor } from 'src/app/core/models/monitor';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CsvDataServiceService } from 'src/app/core/services/history/csv-data-service.service';
import { HistoryService } from 'src/app/core/services/history/history.service';
import { TranslateService } from '@ngx-translate/core';
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
    public csvService: CsvDataServiceService,

    private translate: TranslateService
  ) {
    this.getAll();
    this.lastEvent();
    this.downtime = [];
  }
  disableSelect = new FormControl(false);
  displayedColumn: string[] = ['name', 'status', 'startedAt'];
  displayedColumns: string[] = ['status', 'name', 'description', 'url', 'actions'];
  dataSource = new MatTableDataSource<Monitor>();
  dataSourceEvents = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  stopped: number;
  active: number;
  down: number;

  all: number;
  numItem = 0;
  pageSize = 1;
  downtime: any[];

  lastEventMonitor: string;
  lastEventTime: any;

  getAll() {
    return this.monitorService.getMonitors().subscribe((res: any) => {
      this.dataSource.data = res.data as Monitor[];
      this.dataSource.paginator = this.paginator;
    });
  }
  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.socketConnection();
    this.countMonitorStopped();
    this.countMonitorActive();
    this.countMonitorDown();
    this.latestEvents();
    this.countAll();
  }
  socketConnection() {
    this.socketService.setupSocketConnection();
    this.socketService.statusMonitor$.subscribe((monitor) => {
      const objIndex = this.dataSource.data.findIndex((obj) => obj.id === monitor.id);
      this.dataSource.data[objIndex] = monitor;
      this.dataSource.connect().next(this.dataSource.data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteMonitor(id: any) {
    this.monitorService.deleteMonitor(id).subscribe((res) => {
      this.getAll();
      this.toastr.success(this.translate.instant('MONITORS.delete_monitor'));
    });
  }

  startMonitor(id) {
    this.monitorService.startMonitor(id).subscribe((res) => {
      this.getAll();
      this.toastr.success(this.translate.instant('MONITORS.start_monitor'));
    });
  }

  stopMonitor(id) {
    this.monitorService.stopMonitor(id).subscribe((res) => {
      this.getAll();
      this.toastr.success(this.translate.instant('MONITORS.stop_monitor'));
    });
  }

  countMonitorStopped() {
    return this.monitorService.getCountMonitorsOnStatus().subscribe((res) => {
      this.stopped = res.stopped[1];
    });
  }
  countMonitorActive() {
    this.monitorService.getCountMonitorsOnStatus().subscribe((res) => {
      this.active = res.active[1];
    });
  }
  countMonitorDown() {
    this.monitorService.getCountMonitorsOnStatus().subscribe((res) => {
      this.down = res.down[1];
    });
  }

  countAll() {
    this.monitorService.getCountMonitors().subscribe((res) => {
      this.all = res.data[1];
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
        this.lastEventMonitor = data.monitor.name;
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
