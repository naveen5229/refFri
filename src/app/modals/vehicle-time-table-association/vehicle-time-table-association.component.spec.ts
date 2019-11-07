import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTimeTableAssociationComponent } from './vehicle-time-table-association.component';

describe('VehicleTimeTableAssociationComponent', () => {
  let component: VehicleTimeTableAssociationComponent;
  let fixture: ComponentFixture<VehicleTimeTableAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTimeTableAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTimeTableAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
