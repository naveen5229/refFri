import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleGpsDetailComponent } from './vehicle-gps-detail.component';

describe('VehicleGpsDetailComponent', () => {
  let component: VehicleGpsDetailComponent;
  let fixture: ComponentFixture<VehicleGpsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleGpsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleGpsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
