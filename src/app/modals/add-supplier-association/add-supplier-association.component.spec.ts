import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierAssociationComponent } from './add-supplier-association.component';

describe('AddSupplierAssociationComponent', () => {
  let component: AddSupplierAssociationComponent;
  let fixture: ComponentFixture<AddSupplierAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSupplierAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupplierAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
