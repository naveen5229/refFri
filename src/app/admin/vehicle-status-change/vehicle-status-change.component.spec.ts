import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleStatusChangeComponent } from './vehicle-status-change.component';

describe('VehicleStatusChangeComponent', () => {
  let component: VehicleStatusChangeComponent;
  let fixture: ComponentFixture<VehicleStatusChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleStatusChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleStatusChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
