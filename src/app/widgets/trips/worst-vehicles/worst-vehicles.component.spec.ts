import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstVehiclesComponent } from './worst-vehicles.component';

describe('WorstVehiclesComponent', () => {
  let component: WorstVehiclesComponent;
  let fixture: ComponentFixture<WorstVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstVehiclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
