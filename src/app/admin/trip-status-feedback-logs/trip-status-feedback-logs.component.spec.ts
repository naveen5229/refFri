import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripStatusFeedbackLogsComponent } from './trip-status-feedback-logs.component';

describe('TripStatusFeedbackLogsComponent', () => {
  let component: TripStatusFeedbackLogsComponent;
  let fixture: ComponentFixture<TripStatusFeedbackLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripStatusFeedbackLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripStatusFeedbackLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
