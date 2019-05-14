import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTripComponent } from './vehicle-trip.component';

describe('VehicleTripComponent', () => {
  let component: VehicleTripComponent;
  let fixture: ComponentFixture<VehicleTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
