import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightInvoicesComponent } from './freight-invoices.component';

describe('FreightInvoicesComponent', () => {
  let component: FreightInvoicesComponent;
  let fixture: ComponentFixture<FreightInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
