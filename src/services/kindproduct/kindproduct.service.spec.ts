import { TestBed } from '@angular/core/testing';

import { KindproductService } from './kindproduct.service';

describe('KindproductService', () => {
  let service: KindproductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KindproductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
