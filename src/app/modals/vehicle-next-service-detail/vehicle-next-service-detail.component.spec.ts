import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleNextServiceDetailComponent } from './vehicle-next-service-detail.component';

describe('VehicleNextServiceDetailComponent', () => {
  let component: VehicleNextServiceDetailComponent;
  let fixture: ComponentFixture<VehicleNextServiceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleNextServiceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleNextServiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
