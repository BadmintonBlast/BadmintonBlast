import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserbookingComponent } from './userbooking.component';

describe('UserbookingComponent', () => {
  let component: UserbookingComponent;
  let fixture: ComponentFixture<UserbookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserbookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
