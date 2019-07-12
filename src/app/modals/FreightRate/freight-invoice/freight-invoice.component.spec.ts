import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightInvoiceComponent } from './freight-invoice.component';

describe('FreightInvoiceComponent', () => {
  let component: FreightInvoiceComponent;
  let fixture: ComponentFixture<FreightInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
