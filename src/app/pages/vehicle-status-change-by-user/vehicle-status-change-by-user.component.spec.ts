import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleStatusChangeByUserComponent } from './vehicle-status-change-by-user.component';

describe('VehicleStatusChangeByUserComponent', () => {
  let component: VehicleStatusChangeByUserComponent;
  let fixture: ComponentFixture<VehicleStatusChangeByUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleStatusChangeByUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleStatusChangeByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
