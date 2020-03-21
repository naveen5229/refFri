import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleOrdersComponent } from './vehicle-orders.component';

describe('VehicleOrdersComponent', () => {
  let component: VehicleOrdersComponent;
  let fixture: ComponentFixture<VehicleOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
