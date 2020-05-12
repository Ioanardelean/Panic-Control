import { Component, OnInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface Ping {
  ping: number;
}

export interface Interval {
  monitorInterval: number;
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
  ) {}
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  isSubmitted = false;
  emails: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  createForm: FormGroup;

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

  isShowDivIf = false;
  isShowNextDivIf = false;

  ngOnInit(): void {
    this.creationForm();
  }

  creationForm() {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      url: ['', [Validators.required]],
      receiver: [this.emails, [Validators.required]],
      ping: ['', [Validators.required]],
      monitorInterval: ['', [Validators.required]],
      emailTemplate: [''],
      testRunning: [''],
    });
  }

  toggleDisplayDivIf() {
    this.isShowDivIf = true;
    this.isShowNextDivIf = false;
  }
  toggleDisplayNextDivIf() {
    this.isShowDivIf = false;
    this.isShowNextDivIf = true;
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
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  onChange() {
    console.log();
  }
  public errorHandling = (control: string, error: string) => {
    return this.createForm.controls[control].hasError(error);
  };

  createProject() {
    this.isSubmitted = true;
    if (this.createForm.invalid) {
      console.log('*******************');
      return;
    }
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
