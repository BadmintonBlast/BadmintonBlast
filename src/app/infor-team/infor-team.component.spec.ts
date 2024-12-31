import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforTeamComponent } from './infor-team.component';

describe('InforTeamComponent', () => {
  let component: InforTeamComponent;
  let fixture: ComponentFixture<InforTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InforTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InforTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
