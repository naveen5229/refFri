import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTrollyMappingComponent } from './vehicle-trolly-mapping.component';

describe('VehicleTrollyMappingComponent', () => {
  let component: VehicleTrollyMappingComponent;
  let fixture: ComponentFixture<VehicleTrollyMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTrollyMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTrollyMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
