import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlowestOnwardVehicleComponent } from './slowest-onward-vehicle.component';

describe('SlowestOnwardVehicleComponent', () => {
  let component: SlowestOnwardVehicleComponent;
  let fixture: ComponentFixture<SlowestOnwardVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlowestOnwardVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlowestOnwardVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
