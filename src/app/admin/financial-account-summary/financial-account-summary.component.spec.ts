import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountSummaryComponent } from './financial-account-summary.component';

describe('FinancialAccountSummaryComponent', () => {
  let component: FinancialAccountSummaryComponent;
  let fixture: ComponentFixture<FinancialAccountSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialAccountSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialAccountSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
