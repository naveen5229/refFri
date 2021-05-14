import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsPerformanceComponent } from './gps-performance.component';

describe('GpsPerformanceComponent', () => {
  let component: GpsPerformanceComponent;
  let fixture: ComponentFixture<GpsPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpsPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
