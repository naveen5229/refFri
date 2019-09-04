import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverLedgerMappingComponent } from './driver-ledger-mapping.component';

describe('DriverLedgerMappingComponent', () => {
  let component: DriverLedgerMappingComponent;
  let fixture: ComponentFixture<DriverLedgerMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverLedgerMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverLedgerMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
