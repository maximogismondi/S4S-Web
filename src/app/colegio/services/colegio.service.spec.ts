import { TestBed } from '@angular/core/testing';

import { ColegioService } from './colegio.service';

describe('ColegioService', () => {
  let service: ColegioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColegioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
