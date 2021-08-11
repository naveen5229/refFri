import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDriverVehicleComponent } from './add-driver-vehicle.component';

describe('AddDriverVehicleComponent', () => {
  let component: AddDriverVehicleComponent;
  let fixture: ComponentFixture<AddDriverVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDriverVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDriverVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
