import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverAttendanceComponent } from './driver-attendance.component';

describe('DriverAttendanceComponent', () => {
  let component: DriverAttendanceComponent;
  let fixture: ComponentFixture<DriverAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
