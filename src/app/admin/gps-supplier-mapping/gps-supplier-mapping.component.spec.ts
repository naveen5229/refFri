import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsSupplierMappingComponent } from './gps-supplier-mapping.component';

describe('GpsSupplierMappingComponent', () => {
  let component: GpsSupplierMappingComponent;
  let fixture: ComponentFixture<GpsSupplierMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpsSupplierMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsSupplierMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
