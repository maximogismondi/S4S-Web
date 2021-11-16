import { TestBed } from '@angular/core/testing';

import { ServiceSpinnerService } from './service-spinner.service';

describe('ServiceSpinnerService', () => {
  let service: ServiceSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
