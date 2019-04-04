import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAnalysisComponent } from './vehicle-analysis.component';

describe('VehicleAnalysisComponent', () => {
  let component: VehicleAnalysisComponent;
  let fixture: ComponentFixture<VehicleAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
