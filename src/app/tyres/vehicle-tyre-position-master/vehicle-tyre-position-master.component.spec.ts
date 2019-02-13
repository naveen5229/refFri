import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTyrePositionMasterComponent } from './vehicle-tyre-position-master.component';

describe('VehicleTyrePositionMasterComponent', () => {
  let component: VehicleTyrePositionMasterComponent;
  let fixture: ComponentFixture<VehicleTyrePositionMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTyrePositionMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTyrePositionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
