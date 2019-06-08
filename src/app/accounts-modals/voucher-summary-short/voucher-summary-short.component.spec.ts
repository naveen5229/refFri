import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherSummaryShortComponent } from './voucher-summary-short.component';

describe('VoucherSummaryShortComponent', () => {
  let component: VoucherSummaryShortComponent;
  let fixture: ComponentFixture<VoucherSummaryShortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherSummaryShortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherSummaryShortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
