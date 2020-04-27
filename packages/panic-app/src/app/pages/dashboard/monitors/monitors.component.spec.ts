import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorsComponent } from './monitors.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Config } from 'src/app/core/config/config';

describe('MonitorsComponent', () => {
  let component: MonitorsComponent;
  let fixture: ComponentFixture<MonitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonitorsComponent],
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
    fixture = TestBed.createComponent(MonitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
