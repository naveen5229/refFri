import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleGpsTrailComponent } from './vehicle-gps-trail.component';

describe('VehicleGpsTrailComponent', () => {
  let component: VehicleGpsTrailComponent;
  let fixture: ComponentFixture<VehicleGpsTrailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleGpsTrailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleGpsTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
