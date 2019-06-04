import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialTollSummaryAddtimeComponent } from './financial-toll-summary-addtime.component';

describe('FinancialTollSummaryAddtimeComponent', () => {
  let component: FinancialTollSummaryAddtimeComponent;
  let fixture: ComponentFixture<FinancialTollSummaryAddtimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialTollSummaryAddtimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialTollSummaryAddtimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
