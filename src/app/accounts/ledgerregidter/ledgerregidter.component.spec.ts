import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerregidterComponent } from './ledgerregidter.component';

describe('LedgerregidterComponent', () => {
  let component: LedgerregidterComponent;
  let fixture: ComponentFixture<LedgerregidterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerregidterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerregidterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
