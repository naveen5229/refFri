import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgeraddressComponent } from './ledgeraddress.component';

describe('LedgeraddressComponent', () => {
  let component: LedgeraddressComponent;
  let fixture: ComponentFixture<LedgeraddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgeraddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgeraddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
