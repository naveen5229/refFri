import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesOnMapComponent } from './vehicles-on-map.component';

describe('VehiclesOnMapComponent', () => {
  let component: VehiclesOnMapComponent;
  let fixture: ComponentFixture<VehiclesOnMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclesOnMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
