import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleMaintainanceMaxDurComponent } from './vehicle-maintainance-max-dur.component';

describe('VehicleMaintainanceMaxDurComponent', () => {
  let component: VehicleMaintainanceMaxDurComponent;
  let fixture: ComponentFixture<VehicleMaintainanceMaxDurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleMaintainanceMaxDurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleMaintainanceMaxDurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
