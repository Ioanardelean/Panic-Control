import { TestBed } from '@angular/core/testing';

import { MonitorService } from './monitor.service';

describe('ProjectService', () => {
  let service: MonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
