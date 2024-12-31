import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopsaleComponent } from './topsale.component';

describe('TopsaleComponent', () => {
  let component: TopsaleComponent;
  let fixture: ComponentFixture<TopsaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopsaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
