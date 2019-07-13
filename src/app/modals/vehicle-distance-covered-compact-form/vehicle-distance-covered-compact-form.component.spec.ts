import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDistanceCoveredCompactFormComponent } from './vehicle-distance-covered-compact-form.component';

describe('VehicleDistanceCoveredCompactFormComponent', () => {
  let component: VehicleDistanceCoveredCompactFormComponent;
  let fixture: ComponentFixture<VehicleDistanceCoveredCompactFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleDistanceCoveredCompactFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDistanceCoveredCompactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
