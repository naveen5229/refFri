import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleModalServiceComponent } from './add-vehicle-modal-service.component';

describe('AddVehicleModalServiceComponent', () => {
  let component: AddVehicleModalServiceComponent;
  let fixture: ComponentFixture<AddVehicleModalServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVehicleModalServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVehicleModalServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
