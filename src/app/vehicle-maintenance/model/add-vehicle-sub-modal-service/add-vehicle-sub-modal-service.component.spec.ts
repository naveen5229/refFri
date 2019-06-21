import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleSubModalServiceComponent } from './add-vehicle-sub-modal-service.component';

describe('AddVehicleSubModalServiceComponent', () => {
  let component: AddVehicleSubModalServiceComponent;
  let fixture: ComponentFixture<AddVehicleSubModalServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddVehicleSubModalServiceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVehicleSubModalServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
