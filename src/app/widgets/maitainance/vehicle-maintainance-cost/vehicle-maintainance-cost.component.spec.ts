import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleMaintainanceCostComponent } from './vehicle-maintainance-cost.component';

describe('VehicleMaintainanceCostComponent', () => {
  let component: VehicleMaintainanceCostComponent;
  let fixture: ComponentFixture<VehicleMaintainanceCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleMaintainanceCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleMaintainanceCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
