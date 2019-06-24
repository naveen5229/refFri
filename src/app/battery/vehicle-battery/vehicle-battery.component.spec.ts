import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBatteryComponent } from './vehicle-battery.component';

describe('VehicleBatteryComponent', () => {
  let component: VehicleBatteryComponent;
  let fixture: ComponentFixture<VehicleBatteryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleBatteryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleBatteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
