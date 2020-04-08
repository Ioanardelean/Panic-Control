import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePanicComponent } from './manage-panic.component';

describe('ManagePanicComponent', () => {
  let component: ManagePanicComponent;
  let fixture: ComponentFixture<ManagePanicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePanicComponent ]
    })
    .compileComponents();
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
