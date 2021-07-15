import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapVehicleComponentComponent } from './add-map-vehicle-component.component';

describe('AddMapVehicleComponentComponent', () => {
  let component: AddMapVehicleComponentComponent;
  let fixture: ComponentFixture<AddMapVehicleComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMapVehicleComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapVehicleComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
