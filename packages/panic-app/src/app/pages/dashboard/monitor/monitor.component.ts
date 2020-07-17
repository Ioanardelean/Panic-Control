import { Component, OnInit, ViewChild } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as data from 'src/app/core/validators/monitor.message.json';
import { TranslateService } from '@ngx-translate/core';
import { monitor } from 'src/app/core/validators/monitor.validator';

import { QuillModules, defaultModules } from 'ngx-quill';

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
  @ViewChild('chipList') chipList: MatChipList;
  constructor(
    public formBuilder: FormBuilder,
    public monitorService: MonitorService,
    public router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  isSubmitted = false;
  emails: string[] = [];
  monitorValidationMessages = (data as any).default;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  createForm: FormGroup;
  quillModules: QuillModules = {
    toolbar: {
      container: defaultModules.toolbar,
      handlers: {
        image: this.imageHandler,
      },
    },
  };

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
    this.createForm
      .get('receiver')
      .statusChanges.subscribe(
        (status) => (this.chipList.errorState = status === 'INVALID')
      );
  }

  imageHandler(this: any) {
    const tooltip = this.quill.theme.tooltip;
    const originalSave = tooltip.save;
    tooltip.save = function (this: any) {
      const range = this.quill.getSelection(true);
      const value = this.textbox.value;
      if (value) {
        this.quill.insertEmbed(range.index, 'image', value, 'user');
      }
      tooltip.save = originalSave;
    };
    tooltip.edit('image');
  }

  creationForm() {
    this.createForm = this.formBuilder.group(monitor);
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

  createProject() {
    this.isSubmitted = true;
    if (this.createForm.invalid) {
      return;
    }
    this.monitorService.addProject(this.createForm.value).subscribe(
      (res) => {
        if (res.data) {
          this.createForm.reset();
          this.toastr.success(this.translate.instant('MONITORS.created_monitor'));
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(res.error);
        }
      },
      (error) => {
        this.toastr.error(this.translate.instant('MONITORS.exists'));
      }
    );
  }
}
