import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverVehicleRemappingComponent } from './driver-vehicle-remapping.component';

describe('DriverVehicleRemappingComponent', () => {
  let component: DriverVehicleRemappingComponent;
  let fixture: ComponentFixture<DriverVehicleRemappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverVehicleRemappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverVehicleRemappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
