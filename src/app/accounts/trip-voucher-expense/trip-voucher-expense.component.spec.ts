import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripVoucherExpenseComponent } from './trip-voucher-expense.component';

describe('TripVoucherExpenseComponent', () => {
  let component: TripVoucherExpenseComponent;
  let fixture: ComponentFixture<TripVoucherExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripVoucherExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripVoucherExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
