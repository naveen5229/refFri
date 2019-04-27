import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCoveredDistanceComponent } from './vehicle-covered-distance.component';

describe('VehicleCoveredDistanceComponent', () => {
  let component: VehicleCoveredDistanceComponent;
  let fixture: ComponentFixture<VehicleCoveredDistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleCoveredDistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleCoveredDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
