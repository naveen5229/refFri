import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelAnalysisComponent } from './fuel-analysis.component';

describe('FuelAnalysisComponent', () => {
  let component: FuelAnalysisComponent;
  let fixture: ComponentFixture<FuelAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
