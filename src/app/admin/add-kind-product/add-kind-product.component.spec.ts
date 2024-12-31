import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKindProductComponent } from './add-kind-product.component';

describe('AddKindProductComponent', () => {
  let component: AddKindProductComponent;
  let fixture: ComponentFixture<AddKindProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddKindProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddKindProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
