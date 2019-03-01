import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTripUpdateComponent } from './vehicle-trip-update.component';

describe('VehicleTripUpdateComponent', () => {
  let component: VehicleTripUpdateComponent;
  let fixture: ComponentFixture<VehicleTripUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTripUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTripUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
