import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DowntimeComponent } from './downtime.component';
import { Config } from 'src/app/core/config/config';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';

describe('DowntimeComponent', () => {
  let component: DowntimeComponent;
  let fixture: ComponentFixture<DowntimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DowntimeComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [FormBuilder, AuthService, Config],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DowntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
