import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestUnloadingVehicleComponent } from './longest-unloading-vehicle.component';

describe('LongestUnloadingVehicleComponent', () => {
  let component: LongestUnloadingVehicleComponent;
  let fixture: ComponentFixture<LongestUnloadingVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestUnloadingVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestUnloadingVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
