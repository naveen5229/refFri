import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleLrComponent } from './vehicle-lr.component';

describe('VehicleLrComponent', () => {
  let component: VehicleLrComponent;
  let fixture: ComponentFixture<VehicleLrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleLrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleLrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
