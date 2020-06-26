import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { ActivatedRoute } from '@angular/router';
import { History } from '../../../core/models/history';
import { CsvDataServiceService } from 'src/app/core/services/history/csv-data-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HistoryService } from 'src/app/core/services/history/history.service';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-downtime',
  templateUrl: './downtime.component.html',
  styleUrls: ['./downtime.component.scss'],
})
export class DowntimeComponent implements OnInit {
  displayedColumns: string[] = ['status', 'startedAt'];
  dataSource = new MatTableDataSource<History>();
  monitorName: string;
  monitorUrl: string;

  constructor(
    public monitorService: MonitorService,
    public route: ActivatedRoute,
    public csvService: CsvDataServiceService,
    public historyService: HistoryService,
    private translate: TranslateService
  ) {
    this.getProject(this.route.snapshot.params.id);
    this.getDowntimeOnYear(this.route.snapshot.params.id);
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  lineChartData: ChartDataSets[] = [{ data: [], label: '' }];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderWidth: 1,
      borderColor: '#0a2d48',
      backgroundColor: 'rgba(77, 216, 171, 0.3)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.getProjectDetail(this.route.snapshot.params.id);
  }

  getProject(id) {
    this.historyService.getDowntimeOnProject(id).subscribe((res) => {
      const data = res.data;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
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
    console.log(this.dataSource.data);
    const data = this.dataSource.data;
    this.csvService.exportToCsv('downtime.csv', data);
  }

  getDowntimeOnYear(id) {
    this.historyService.getYearDowntimeOnProject(id).subscribe((res: any) => {
      const monthNames = [
        this.translate.instant('DOWNTIME.jan'),
        this.translate.instant('DOWNTIME.feb'),
        this.translate.instant('DOWNTIME.mar'),
        this.translate.instant('DOWNTIME.apr'),
        this.translate.instant('DOWNTIME.may'),
        this.translate.instant('DOWNTIME.jun'),
        this.translate.instant('DOWNTIME.jul'),
        this.translate.instant('DOWNTIME.aug'),
        this.translate.instant('DOWNTIME.sep'),
        this.translate.instant('DOWNTIME.oct'),
        this.translate.instant('DOWNTIME.nov'),
        this.translate.instant('DOWNTIME.dec'),
      ];

      const groupByMonth = (jsonData, keyToGroup) => {
        return jsonData.reduce((array, item) => {
          const itemDate = new Date(item[keyToGroup]);
          const itemMonth = monthNames[itemDate.getMonth()];
          (array[itemMonth] = array[itemMonth] || []).push(item);
          return array;
        }, {});
      };

      const groupedByMonth = groupByMonth(res.data, 'startedAt');
      const arrTotals = [];
      Object.keys(groupedByMonth).forEach((key) => {
        let monthTotal = 0;
        let avg = 0;
        Object.keys(groupedByMonth[key]).forEach((subKey) => {
          monthTotal += groupedByMonth[key][subKey].uptime;
          avg = monthTotal / groupedByMonth[key].length;
        });
        arrTotals.push(avg);
      });
      this.lineChartData = [
        { data: arrTotals, label: this.translate.instant('DOWNTIME.label') },
      ];
      this.lineChartLabels = Object.keys(groupedByMonth);
    });
  }
}
