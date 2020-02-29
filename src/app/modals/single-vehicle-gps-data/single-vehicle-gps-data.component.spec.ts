import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleVehicleGpsDataComponent } from './single-vehicle-gps-data.component';

describe('SingleVehicleGpsDataComponent', () => {
  let component: SingleVehicleGpsDataComponent;
  let fixture: ComponentFixture<SingleVehicleGpsDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleVehicleGpsDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleVehicleGpsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
