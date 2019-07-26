import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LRRateCalculatorComponent } from './lrrate-calculator.component';

describe('LRRateCalculatorComponent', () => {
  let component: LRRateCalculatorComponent;
  let fixture: ComponentFixture<LRRateCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LRRateCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LRRateCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
