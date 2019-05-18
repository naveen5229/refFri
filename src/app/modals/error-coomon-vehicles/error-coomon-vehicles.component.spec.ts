import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorCoomonVehiclesComponent } from './error-coomon-vehicles.component';

describe('ErrorCoomonVehiclesComponent', () => {
  let component: ErrorCoomonVehiclesComponent;
  let fixture: ComponentFixture<ErrorCoomonVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorCoomonVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorCoomonVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
