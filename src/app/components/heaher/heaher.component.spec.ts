import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaherComponent } from './heaher.component';

describe('HeaherComponent', () => {
  let component: HeaherComponent;
  let fixture: ComponentFixture<HeaherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
