import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelAverageIssuesComponent } from './fuel-average-issues.component';

describe('FuelAverageIssuesComponent', () => {
  let component: FuelAverageIssuesComponent;
  let fixture: ComponentFixture<FuelAverageIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelAverageIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelAverageIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
