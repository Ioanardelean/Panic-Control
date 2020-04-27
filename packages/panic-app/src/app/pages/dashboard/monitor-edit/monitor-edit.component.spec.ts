import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorEditComponent } from './monitor-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { FormBuilder } from '@angular/forms';
import { MonitorService } from 'src/app/core/services/monitor/monitor.service';
import { Config } from 'src/app/core/config/config';

describe('MonitorEditComponent', () => {
  let component: MonitorEditComponent;
  let fixture: ComponentFixture<MonitorEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonitorEditComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        MatMenuModule,
      ],
      providers: [FormBuilder, MonitorService, Config],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
