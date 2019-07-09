import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LrInvoiceColumnsComponent } from './lr-invoice-columns.component';

describe('LrInvoiceColumnsComponent', () => {
  let component: LrInvoiceColumnsComponent;
  let fixture: ComponentFixture<LrInvoiceColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LrInvoiceColumnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LrInvoiceColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
