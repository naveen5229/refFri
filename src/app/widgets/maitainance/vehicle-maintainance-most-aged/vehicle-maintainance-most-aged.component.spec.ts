import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleMaintainanceMostAgedComponent } from './vehicle-maintainance-most-aged.component';

describe('VehicleMaintainanceMostAgedComponent', () => {
  let component: VehicleMaintainanceMostAgedComponent;
  let fixture: ComponentFixture<VehicleMaintainanceMostAgedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleMaintainanceMostAgedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleMaintainanceMostAgedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
