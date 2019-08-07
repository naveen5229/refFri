import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyLedgerMappingComponent } from './party-ledger-mapping.component';

describe('PartyLedgerMappingComponent', () => {
  let component: PartyLedgerMappingComponent;
  let fixture: ComponentFixture<PartyLedgerMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyLedgerMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyLedgerMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
