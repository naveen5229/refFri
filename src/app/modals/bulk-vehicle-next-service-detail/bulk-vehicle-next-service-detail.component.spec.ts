import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkVehicleNextServiceDetailComponent } from './bulk-vehicle-next-service-detail.component';

describe('BulkVehicleNextServiceDetailComponent', () => {
  let component: BulkVehicleNextServiceDetailComponent;
  let fixture: ComponentFixture<BulkVehicleNextServiceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkVehicleNextServiceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkVehicleNextServiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
