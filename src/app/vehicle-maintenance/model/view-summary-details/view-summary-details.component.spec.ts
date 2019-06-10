import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSummaryDetailsComponent } from './view-summary-details.component';

describe('AddMaintenanceComponent', () => {
  let component: ViewSummaryDetailsComponent;
  let fixture: ComponentFixture<ViewSummaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSummaryDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
