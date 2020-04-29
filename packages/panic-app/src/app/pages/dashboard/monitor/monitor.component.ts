import { Component, OnInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface Ping {
  ping: number;
}
@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent implements OnInit {
  constructor(
    public formBuilder: FormBuilder,
    public monitorService: MonitorService,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.createForm = this.formBuilder.group({
      name: [''],
      description: [''],
      url: [''],
      receiver: [this.emails],
      ping: [''],
      monitorInterval: [''],
      emailTemplate: [''],
      testRunning: [''],
    });
  }
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  emails: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  createForm: FormGroup;
  emailCtrl = new FormControl();
  public value = '';

  pings: Ping[] = [{ ping: 10 }, { ping: 20 }, { ping: 30 }, { ping: 60 }];

  isShowDivIf = false;
  isShowNextDivIf = false;

  ngOnInit(): void {}

  toggleDisplayDivIf() {
    this.isShowDivIf = true;
    this.isShowNextDivIf = false;
  }
  toggleDisplayNextDivIf() {
    this.isShowDivIf = false;
    this.isShowNextDivIf = true;
  }

  formatLabel(value: number) {
    if (value >= 120) {
      return Math.round(value / 1000) + '';
    }

    return value;
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
    this.createForm.controls.receiver.setValue(this.emails.toString());
    this.emailCtrl.setValue(null);
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  onChange() {
    //
  }

  createProject() {
    this.monitorService.addProject(this.createForm.value).subscribe((res) => {
      if (res.data) {
        this.createForm.reset();
        this.toastr.success(res.message);
        this.router.navigate(['/dashboard']);
      } else {
        this.toastr.error(res.error);
      }
    });
  }
}
