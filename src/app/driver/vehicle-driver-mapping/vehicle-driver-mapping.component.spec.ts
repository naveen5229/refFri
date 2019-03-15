import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDriverMappingComponent } from './vehicle-driver-mapping.component';

describe('VehicleDriverMappingComponent', () => {
  let component: VehicleDriverMappingComponent;
  let fixture: ComponentFixture<VehicleDriverMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleDriverMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDriverMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
