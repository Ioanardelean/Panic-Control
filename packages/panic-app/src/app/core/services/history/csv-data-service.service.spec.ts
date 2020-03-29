import { TestBed } from '@angular/core/testing';

import { CsvDataServiceService } from './csv-data-service.service';

describe('CsvDataServiceService', () => {
  let service: CsvDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
