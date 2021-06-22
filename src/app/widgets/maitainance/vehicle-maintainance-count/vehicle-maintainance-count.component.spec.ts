import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleMaintainanceCountComponent } from './vehicle-maintainance-count.component';

describe('VehicleMaintainanceCountComponent', () => {
  let component: VehicleMaintainanceCountComponent;
  let fixture: ComponentFixture<VehicleMaintainanceCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleMaintainanceCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleMaintainanceCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
