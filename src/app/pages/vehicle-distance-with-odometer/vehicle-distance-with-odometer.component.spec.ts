import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDistanceWithOdometerComponent } from './vehicle-distance-with-odometer.component';

describe('VehicleDistanceWithOdometerComponent', () => {
  let component: VehicleDistanceWithOdometerComponent;
  let fixture: ComponentFixture<VehicleDistanceWithOdometerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleDistanceWithOdometerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDistanceWithOdometerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
