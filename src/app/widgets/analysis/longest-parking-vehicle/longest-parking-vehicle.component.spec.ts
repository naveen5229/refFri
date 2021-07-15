import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestParkingVehicleComponent } from './longest-parking-vehicle.component';

describe('LongestParkingVehicleComponent', () => {
  let component: LongestParkingVehicleComponent;
  let fixture: ComponentFixture<LongestParkingVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestParkingVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestParkingVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
