import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { ActivatedRoute } from '@angular/router';
import { History } from '../../../core/models/history';
import { CsvDataServiceService } from 'src/app/core/services/history/csv-data-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HistoryService } from 'src/app/core/services/history/history.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-downtime',
  templateUrl: './downtime.component.html',
  styleUrls: ['./downtime.component.scss'],
})
export class DowntimeComponent implements OnInit {
  displayedColumns: string[] = ['status', 'startedAt'];
  dataSource = new MatTableDataSource<History>();
  chart: any;

  monitorName: string;
  monitorUrl: string;

  constructor(
    public monitorService: MonitorService,
    public route: ActivatedRoute,
    public csvService: CsvDataServiceService,
    public historyService: HistoryService
  ) {
    this.getProject(this.route.snapshot.params.id);
    this.getDowntimeOnYear(this.route.snapshot.params.id);
    this.chart = [];
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.getProjectDetail(this.route.snapshot.params.id);
  }

  getProject(id) {
    this.historyService.getDowntimeOnProject(id).subscribe((res) => {
      const data = res.data;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      console.log(data);
    });
  }
  getProjectDetail(id) {
    this.monitorService.getProject(id).subscribe((res) => {
      const data = res.data;
      this.monitorName = data.name;
      this.monitorUrl = data.url;
    });
  }

  exportCsv() {
    const data = this.dataSource.data;
    this.csvService.exportToCsv('downtime.csv', data);
  }

  getDowntimeOnYear(id) {
    this.historyService.getYearDowntimeOnProject(id).subscribe((res) => {
      const uptime = res['data'].map((res) => res.uptime);
      const allDates = res['data'].map((res) => res.startedAt);

      const dates = [];
      allDates.forEach((res) => {
        const date = new Date(res);
        dates.push(date.toLocaleDateString('en', { year: 'numeric', month: 'short' }));
      });
      this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              data: uptime,
              borderColor: '#4dd8ab',
              backgroundColor: '#cfd8dc',
              fill: false,
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                display: true,
              },
            ],
            yAxes: [
              {
                display: true,
              },
            ],
          },
        },
      });
    });
  }
}
