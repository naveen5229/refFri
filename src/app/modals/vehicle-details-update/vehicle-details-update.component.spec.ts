import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsUpdateComponent } from './vehicle-details-update.component';

describe('VehicleDetailsUpdateComponent', () => {
  let component: VehicleDetailsUpdateComponent;
  let fixture: ComponentFixture<VehicleDetailsUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleDetailsUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDetailsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
