import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualTollTransactionSummaryComponent } from './manual-toll-transaction-summary.component';

describe('ManualTollTransactionSummaryComponent', () => {
  let component: ManualTollTransactionSummaryComponent;
  let fixture: ComponentFixture<ManualTollTransactionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualTollTransactionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualTollTransactionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
