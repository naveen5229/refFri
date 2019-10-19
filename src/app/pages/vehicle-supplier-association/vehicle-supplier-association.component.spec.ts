import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSupplierAssociationComponent } from './vehicle-supplier-association.component';

describe('VehicleSupplierAssociationComponent', () => {
  let component: VehicleSupplierAssociationComponent;
  let fixture: ComponentFixture<VehicleSupplierAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleSupplierAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSupplierAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
