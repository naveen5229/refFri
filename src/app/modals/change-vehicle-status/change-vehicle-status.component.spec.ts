import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeVehicleStatusComponent } from './change-vehicle-status.component';

describe('ChangeVehicleStatusComponent', () => {
  let component: ChangeVehicleStatusComponent;
  let fixture: ComponentFixture<ChangeVehicleStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeVehicleStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeVehicleStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
