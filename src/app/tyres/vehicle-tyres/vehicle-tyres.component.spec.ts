import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTyresComponent } from './vehicle-tyres.component';

describe('VehicleTyresComponent', () => {
  let component: VehicleTyresComponent;
  let fixture: ComponentFixture<VehicleTyresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTyresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTyresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
