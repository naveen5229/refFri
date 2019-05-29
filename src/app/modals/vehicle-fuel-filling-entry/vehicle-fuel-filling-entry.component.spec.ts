import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFuelFillingEntryComponent } from './vehicle-fuel-filling-entry.component';

describe('VehicleFuelFillingEntryComponent', () => {
  let component: VehicleFuelFillingEntryComponent;
  let fixture: ComponentFixture<VehicleFuelFillingEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleFuelFillingEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleFuelFillingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
