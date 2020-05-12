import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Interval } from '../monitor/monitor.component';

export interface Ping {
  ping: number;
}
@Component({
  selector: 'app-monitor-edit',
  templateUrl: './monitor-edit.component.html',
  styleUrls: ['./monitor-edit.component.scss'],
})
export class MonitorEditComponent implements OnInit {
  constructor(
    public formBuilder: FormBuilder,
    public monitorService: MonitorService,
    public router: Router,
    public route: ActivatedRoute,
    private toastr: ToastrService
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
  }

  update() {
    this.updateForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      description: [''],
      url: ['', [Validators.required]],
      receiver: [this.emails, [Validators.required]],
      ping: ['', [Validators.required]],
      monitorInterval: ['', [Validators.required]],
      emailTemplate: [''],
      testRunning: [''],
      status: null,
      user: [''],
      histories: [''],
    });
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
      const data = res.data;
      this.emails = res.data.receiver.split(',');
      this.id = data.id;
      this.updateForm.setValue(data);
    });
  }

  updateProject() {
    this.isSubmitted = true;
    if (this.updateForm.invalid) {
      return;
    }
    this.monitorService.updateProject(this.updateForm.value, this.id).subscribe((res) => {
      if (res.message) {
        this.toastr.success(res.message);
        this.router.navigate(['/dashboard']);
      } else if (res.error) {
        this.toastr.error(res.error);
      }
    });
  }
  public errorHandling = (control: string, error: string) => {
    return this.updateForm.controls[control].hasError(error);
  };
}
