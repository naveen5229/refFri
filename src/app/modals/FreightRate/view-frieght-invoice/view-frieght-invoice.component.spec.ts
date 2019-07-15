import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFrieghtInvoiceComponent } from './view-frieght-invoice.component';

describe('ViewFrieghtInvoiceComponent', () => {
  let component: ViewFrieghtInvoiceComponent;
  let fixture: ComponentFixture<ViewFrieghtInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFrieghtInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFrieghtInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
