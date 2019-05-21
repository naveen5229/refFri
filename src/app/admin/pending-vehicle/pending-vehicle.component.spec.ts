import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingVehicleComponent } from './pending-vehicle.component';

describe('PendingVehicleComponent', () => {
  let component: PendingVehicleComponent;
  let fixture: ComponentFixture<PendingVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
