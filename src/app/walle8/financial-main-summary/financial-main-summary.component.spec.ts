import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialMainSummaryComponent } from './financial-main-summary.component';

describe('FinancialMainSummaryComponent', () => {
  let component: FinancialMainSummaryComponent;
  let fixture: ComponentFixture<FinancialMainSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialMainSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialMainSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
