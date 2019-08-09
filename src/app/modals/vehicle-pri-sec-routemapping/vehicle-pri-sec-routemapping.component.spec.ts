import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePriSecRoutemappingComponent } from './vehicle-pri-sec-routemapping.component';

describe('VehiclePriSecRoutemappingComponent', () => {
  let component: VehiclePriSecRoutemappingComponent;
  let fixture: ComponentFixture<VehiclePriSecRoutemappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclePriSecRoutemappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclePriSecRoutemappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
