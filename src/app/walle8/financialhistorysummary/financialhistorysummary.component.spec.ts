import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialhistorysummaryComponent } from './financialhistorysummary.component';

describe('FinancialhistorysummaryComponent', () => {
  let component: FinancialhistorysummaryComponent;
  let fixture: ComponentFixture<FinancialhistorysummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialhistorysummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialhistorysummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
