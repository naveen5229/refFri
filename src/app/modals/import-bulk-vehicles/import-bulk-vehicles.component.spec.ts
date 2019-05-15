import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBulkVehiclesComponent } from './import-bulk-vehicles.component';

describe('ImportBulkVehiclesComponent', () => {
  let component: ImportBulkVehiclesComponent;
  let fixture: ComponentFixture<ImportBulkVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportBulkVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBulkVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
