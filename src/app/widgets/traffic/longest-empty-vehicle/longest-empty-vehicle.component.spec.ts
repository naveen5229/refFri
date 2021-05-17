import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestEmptyVehicleComponent } from './longest-empty-vehicle.component';

describe('LongestEmptyVehicleComponent', () => {
  let component: LongestEmptyVehicleComponent;
  let fixture: ComponentFixture<LongestEmptyVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestEmptyVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestEmptyVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
