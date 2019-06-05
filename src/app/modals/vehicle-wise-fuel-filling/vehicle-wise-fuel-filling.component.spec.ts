import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleWiseFuelFillingComponent } from './vehicle-wise-fuel-filling.component';

describe('VehicleWiseFuelFillingComponent', () => {
  let component: VehicleWiseFuelFillingComponent;
  let fixture: ComponentFixture<VehicleWiseFuelFillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleWiseFuelFillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleWiseFuelFillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
