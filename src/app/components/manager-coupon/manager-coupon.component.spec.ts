import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCouponComponent } from './manager-coupon.component';

describe('ManagerCouponComponent', () => {
  let component: ManagerCouponComponent;
  let fixture: ComponentFixture<ManagerCouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerCouponComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
