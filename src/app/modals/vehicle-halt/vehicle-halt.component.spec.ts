import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleHaltComponent } from './vehicle-halt.component';

describe('VehicleHaltComponent', () => {
  let component: VehicleHaltComponent;
  let fixture: ComponentFixture<VehicleHaltComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleHaltComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleHaltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
