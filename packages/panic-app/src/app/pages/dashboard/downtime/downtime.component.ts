import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { ActivatedRoute } from '@angular/router';
import { History } from '../../../core/models/history';
import { CsvDataServiceService } from 'src/app/core/services/history/csv-data-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-downtime',
  templateUrl: './downtime.component.html',
  styleUrls: ['./downtime.component.scss'],
})
export class DowntimeComponent implements OnInit {
  displayedColumns: string[] = ['status', 'startedAt'];
  dataSource = new MatTableDataSource<History>();

  lineChartData: ChartDataSets[] = [{ data: [85, 72, 78, 75, 77, 75], label: 'panic' }];

  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'grey',
      backgroundColor: '#4dd8ab',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  monitorName: string;
  monitorUrl: string;
  downtime: any[];
  id: string;

  constructor(
    public monitorService: MonitorService,
    public route: ActivatedRoute,
    public csvService: CsvDataServiceService
  ) {
    this.getProject(this.route.snapshot.params['id']);
    this.downtime = [];
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  getProject(id) {
    this.monitorService.getProject(id).subscribe((res) => {
      const data = res.data;
      res.data.histories.forEach((element) => {
        const url = element.url;
        const incident = element.status;
        if (incident === 'down') {
          const time = element.startedAt;

          this.downtime.push({
            url,
            status: incident,
            startedAt: time,
          });
        }
      });
      this.dataSource.data = this.downtime;
      this.dataSource.paginator = this.paginator;
      this.monitorName = data.name;
      this.monitorUrl = data.url;
    });
  }

  exportCsv() {
    const data = this.dataSource.data;
    this.csvService.exportToCsv('downtime.csv', data);
  }
}
