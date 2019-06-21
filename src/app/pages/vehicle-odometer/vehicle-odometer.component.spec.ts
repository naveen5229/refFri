import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleOdometerComponent } from './vehicle-odometer.component';

describe('VehicleOdometerComponent', () => {
  let component: VehicleOdometerComponent;
  let fixture: ComponentFixture<VehicleOdometerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleOdometerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleOdometerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
