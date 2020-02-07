import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiVehicleHaltAddComponent } from './multi-vehicle-halt-add.component';

describe('MultiVehicleHaltAddComponent', () => {
  let component: MultiVehicleHaltAddComponent;
  let fixture: ComponentFixture<MultiVehicleHaltAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiVehicleHaltAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiVehicleHaltAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
