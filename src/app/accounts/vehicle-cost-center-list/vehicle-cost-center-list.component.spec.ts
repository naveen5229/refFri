import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCostCenterListComponent } from './vehicle-cost-center-list.component';

describe('VehicleCostCenterListComponent', () => {
  let component: VehicleCostCenterListComponent;
  let fixture: ComponentFixture<VehicleCostCenterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleCostCenterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleCostCenterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
