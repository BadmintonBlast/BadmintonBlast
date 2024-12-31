import { TestBed } from '@angular/core/testing';

import { ProductstockService } from './productstock.service';

describe('ProductstockService', () => {
  let service: ProductstockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductstockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
