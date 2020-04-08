import { Component, OnInit, ViewChild } from '@angular/core';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { Project } from 'src/app/core/models/monitor';
import { MatPaginator } from '@angular/material/paginator';
import { AdminService } from 'src/app/core/services/admin/admin.service';

@Component({
  selector: 'app-manage-panic',
  templateUrl: './manage-panic.component.html',
  styleUrls: ['./manage-panic.component.scss'],
})
export class ManagePanicComponent implements OnInit {
  constructor(
    public adminService: AdminService,

    public monitorService: MonitorService,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.getAll();
    this.listOfUsers();
  }
  displayedColumns: string[] = ['status', 'name', 'description', 'url', 'actions'];
  displayedColumnsForUsers: string[] = ['username', 'email', 'role', 'action'];
  dataSource = new MatTableDataSource<Project>();
  dataSourceUsers = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.listOfUsers();
  }
  getAll() {
    return this.adminService.getAdminInterface().subscribe((res: any) => {
      console.log(res);
      this.dataSource.data = res.data as Project[];
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteUser(id: any) {
    this.adminService.deleteUser(id).subscribe((res) => {
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

  listOfUsers() {
    this.adminService.getUsers().subscribe((res) => {
      this.dataSourceUsers.data = res.data as any[];
    });
  }
  deleteProject(id: any) {
    this.monitorService.deleteProject(id).subscribe((res) => {
      this.getAll();
      this.toastr.success(res.message);
    });
  }
}
