import { TestBed } from '@angular/core/testing';

import { AlertPollingService } from './alert-polling.service';

describe('AlertPollingService', () => {
  let service: AlertPollingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertPollingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
