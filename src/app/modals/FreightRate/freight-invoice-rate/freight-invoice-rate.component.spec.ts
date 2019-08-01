import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightInvoiceRateComponent } from './freight-invoice-rate.component';

describe('FreightInvoiceRateComponent', () => {
  let component: FreightInvoiceRateComponent;
  let fixture: ComponentFixture<FreightInvoiceRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightInvoiceRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightInvoiceRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
