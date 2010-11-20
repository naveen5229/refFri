import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightRateCalculationComponent } from './freight-rate-calculation.component';

describe('FreightRateCalculationComponent', () => {
  let component: FreightRateCalculationComponent;
  let fixture: ComponentFixture<FreightRateCalculationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightRateCalculationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightRateCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
