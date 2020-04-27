import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePanicComponent } from './manage-panic.component';
import { AdminService } from 'src/app/core/services/admin/admin.service';
import { Config } from 'src/app/core/config/config';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ManagePanicComponent', () => {
  let component: ManagePanicComponent;
  let fixture: ComponentFixture<ManagePanicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePanicComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [AdminService, Config],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePanicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
