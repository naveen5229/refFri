import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeVehicleStatusByCustomerComponent } from './change-vehicle-status-by-customer.component';

describe('ChangeVehicleStatusByCustomerComponent', () => {
  let component: ChangeVehicleStatusByCustomerComponent;
  let fixture: ComponentFixture<ChangeVehicleStatusByCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeVehicleStatusByCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeVehicleStatusByCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
