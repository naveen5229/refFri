import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversAttendanceComponent } from './drivers-attendance.component';

describe('DriversAttendanceComponent', () => {
  let component: DriversAttendanceComponent;
  let fixture: ComponentFixture<DriversAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
