import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanPaymentRequestComponent } from './challan-payment-request.component';

describe('ChallanPaymentRequestComponent', () => {
  let component: ChallanPaymentRequestComponent;
  let fixture: ComponentFixture<ChallanPaymentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallanPaymentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallanPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
