import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleKpisComponent } from './vehicle-kpis.component';

describe('VehicleKpisComponent', () => {
  let component: VehicleKpisComponent;
  let fixture: ComponentFixture<VehicleKpisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleKpisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
