import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTripStagesComponent } from './vehicle-trip-stages.component';

describe('VehicleTripStagesComponent', () => {
  let component: VehicleTripStagesComponent;
  let fixture: ComponentFixture<VehicleTripStagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTripStagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTripStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
