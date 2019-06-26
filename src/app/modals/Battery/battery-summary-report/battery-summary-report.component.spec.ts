import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatterySummaryReportComponent } from './battery-summary-report.component';

describe('BatterySummaryReportComponent', () => {
  let component: BatterySummaryReportComponent;
  let fixture: ComponentFixture<BatterySummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatterySummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatterySummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
