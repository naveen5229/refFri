import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverAttendanceUpdateComponent } from './driver-attendance-update.component';

describe('DriverAttendanceUpdateComponent', () => {
  let component: DriverAttendanceUpdateComponent;
  let fixture: ComponentFixture<DriverAttendanceUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverAttendanceUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverAttendanceUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
