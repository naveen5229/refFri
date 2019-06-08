import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleLedgersComponent } from './vehicle-ledgers.component';

describe('VehicleLedgersComponent', () => {
  let component: VehicleLedgersComponent;
  let fixture: ComponentFixture<VehicleLedgersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleLedgersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleLedgersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
