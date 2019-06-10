import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialTollSummaryComponent } from './financial-toll-summary.component';

describe('FinancialTollSummaryComponent', () => {
  let component: FinancialTollSummaryComponent;
  let fixture: ComponentFixture<FinancialTollSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialTollSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialTollSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
