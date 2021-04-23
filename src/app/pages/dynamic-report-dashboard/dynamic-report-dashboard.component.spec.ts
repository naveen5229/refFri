import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicReportDashboardComponent } from './dynamic-report-dashboard.component';

describe('DynamicReportDashboardComponent', () => {
  let component: DynamicReportDashboardComponent;
  let fixture: ComponentFixture<DynamicReportDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicReportDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
