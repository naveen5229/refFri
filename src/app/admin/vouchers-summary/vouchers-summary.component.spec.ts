import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersSummaryComponent } from './vouchers-summary.component';

describe('VouchersSummaryComponent', () => {
  let component: VouchersSummaryComponent;
  let fixture: ComponentFixture<VouchersSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VouchersSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchersSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
