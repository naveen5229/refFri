import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGpsSupplierComponent } from './add-gps-supplier.component';

describe('AddGpsSupplierComponent', () => {
  let component: AddGpsSupplierComponent;
  let fixture: ComponentFixture<AddGpsSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGpsSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGpsSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
