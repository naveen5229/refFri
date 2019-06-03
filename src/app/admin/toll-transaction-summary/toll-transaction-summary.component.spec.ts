import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollTransactionSummaryComponent } from './toll-transaction-summary.component';

describe('TollTransactionSummaryComponent', () => {
  let component: TollTransactionSummaryComponent;
  let fixture: ComponentFixture<TollTransactionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollTransactionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollTransactionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
