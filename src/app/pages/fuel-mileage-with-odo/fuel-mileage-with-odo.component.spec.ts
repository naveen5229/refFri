import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelMileageWithOdoComponent } from './fuel-mileage-with-odo.component';

describe('FuelMileageWithOdoComponent', () => {
  let component: FuelMileageWithOdoComponent;
  let fixture: ComponentFixture<FuelMileageWithOdoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelMileageWithOdoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelMileageWithOdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
