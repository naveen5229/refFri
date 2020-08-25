import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleStatesComponent } from './vehicle-states.component';

describe('VehicleStatesComponent', () => {
  let component: VehicleStatesComponent;
  let fixture: ComponentFixture<VehicleStatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleStatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
