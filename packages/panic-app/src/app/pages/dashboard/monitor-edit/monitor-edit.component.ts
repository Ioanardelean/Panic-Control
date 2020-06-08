import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Interval } from '../monitor/monitor.component';
import * as data from 'src/app/core/validators/monitor.message.json';
import { CustomValidators } from 'src/app/core/validators/custom.validators';
import { TranslateService } from '@ngx-translate/core';

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
    this.updateForm.get('receiver').statusChanges.subscribe(
      status => this.chipList.errorState = status === 'INVALID'
    );
  }

  update() {
    this.updateForm = this.formBuilder.group({
      id: [''],
      name: ['',
        Validators.compose([Validators.required, Validators.minLength(2)])
      ],
      description: [''],
      url: ['',
        Validators.compose([Validators.required,
        Validators.pattern('^https?:\/\/(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$')],
        )],
      receiver: [this.emails, [Validators.required, CustomValidators.validateArrayNotEmpty]],
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
        this.toastr.success(this.translate.instant('MONITORS.update_monitor'));
        this.router.navigate(['/dashboard']);
      } else if (res.error) {
        this.toastr.error(res.error);
      }
    });
  }

}
