import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayChallanPaymentComponent } from './pay-challan-payment.component';

describe('PayChallanPaymentComponent', () => {
  let component: PayChallanPaymentComponent;
  let fixture: ComponentFixture<PayChallanPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayChallanPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayChallanPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
