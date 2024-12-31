import { TestBed } from '@angular/core/testing';

import { StaticalResultService } from './statical-result.service';

describe('StaticalResultService', () => {
  let service: StaticalResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticalResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
