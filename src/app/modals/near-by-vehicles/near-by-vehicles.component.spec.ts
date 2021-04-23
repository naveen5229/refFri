import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearByVehiclesComponent } from './near-by-vehicles.component';

describe('NearByVehiclesComponent', () => {
  let component: NearByVehiclesComponent;
  let fixture: ComponentFixture<NearByVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NearByVehiclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NearByVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
