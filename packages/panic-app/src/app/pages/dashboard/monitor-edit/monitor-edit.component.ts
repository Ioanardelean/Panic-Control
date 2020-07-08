import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Interval } from '../monitor/monitor.component';
import * as data from 'src/app/core/validators/monitor.message.json';
import { TranslateService } from '@ngx-translate/core';
import { monitor } from 'src/app/core/validators/monitor.validator';

export interface Ping {
  ping: number;
}
@Component({
  selector: 'app-monitor-edit',
  templateUrl: './monitor-edit.component.html',
  styleUrls: ['./monitor-edit.component.scss'],
})
export class MonitorEditComponent implements OnInit {
  monitorValidationMessages = (data as any).default;
  @ViewChild('chipList') chipList: MatChipList;
  constructor(
    public formBuilder: FormBuilder,
    public monitorService: MonitorService,
    public router: Router,
    public route: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.getProject(this.route.snapshot.params.id);
  }
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  emails: string[] = [];

  isSubmitted = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  updateForm: FormGroup;
  id: string;

  pings: Ping[] = [{ ping: 10 }, { ping: 20 }, { ping: 30 }, { ping: 60 }];
  intervals: Interval[] = [
    { monitorInterval: 1 },
    { monitorInterval: 5 },
    { monitorInterval: 10 },
    { monitorInterval: 15 },
    { monitorInterval: 30 },
    { monitorInterval: 45 },
    { monitorInterval: 60 },
  ];
  isShowDivIf = true;

  ngOnInit(): void {
    this.update();
    this.updateForm
      .get('receiver')
      .statusChanges.subscribe(
        (status) => (this.chipList.errorState = status === 'INVALID')
      );
  }

  update() {
    this.updateForm = this.formBuilder.group(monitor);
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.emails.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
    this.updateForm.controls.receiver.setValue(this.emails.toString());
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }
  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
  }

  getProject(id) {
    this.monitorService.getProject(id).subscribe((res) => {
      const dataEdit = res.data;
      this.emails = dataEdit.receiver.split(',');
      this.id = dataEdit.id;
      this.updateForm.setValue(dataEdit);
    });
  }

  updateProject() {
    this.isSubmitted = true;
    if (this.updateForm.invalid) {
      return;
    }
    this.monitorService.updateProject(this.updateForm.value, this.id).subscribe((res) => {
      if (res.message) {
        this.toastr.success(this.translate.instant('MONITORS.update_monitor'));
        this.router.navigate(['/dashboard']);
      } else if (res.error) {
        this.toastr.error(res.error);
      }
    });
  }
}
