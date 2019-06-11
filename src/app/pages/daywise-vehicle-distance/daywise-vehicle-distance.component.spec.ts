import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseVehicleDistanceComponent } from './daywise-vehicle-distance.component';

describe('DaywiseVehicleDistanceComponent', () => {
  let component: DaywiseVehicleDistanceComponent;
  let fixture: ComponentFixture<DaywiseVehicleDistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaywiseVehicleDistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaywiseVehicleDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
