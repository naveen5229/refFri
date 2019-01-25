import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelAverageAnalysisComponent } from './fuel-average-analysis.component';

describe('FuelAverageAnalysisComponent', () => {
  let component: FuelAverageAnalysisComponent;
  let fixture: ComponentFixture<FuelAverageAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelAverageAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelAverageAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
