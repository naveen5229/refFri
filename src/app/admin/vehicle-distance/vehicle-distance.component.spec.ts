import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDistanceComponent } from './vehicle-distance.component';

describe('VehicleDistanceComponent', () => {
  let component: VehicleDistanceComponent;
  let fixture: ComponentFixture<VehicleDistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleDistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
