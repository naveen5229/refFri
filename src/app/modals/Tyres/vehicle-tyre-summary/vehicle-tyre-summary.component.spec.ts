import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTyreSummaryComponent } from './vehicle-tyre-summary.component';

describe('VehicleTyreSummaryComponent', () => {
  let component: VehicleTyreSummaryComponent;
  let fixture: ComponentFixture<VehicleTyreSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTyreSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTyreSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
