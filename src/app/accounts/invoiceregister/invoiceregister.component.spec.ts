import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceregisterComponent } from './invoiceregister.component';

describe('InvoiceregisterComponent', () => {
  let component: InvoiceregisterComponent;
  let fixture: ComponentFixture<InvoiceregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
