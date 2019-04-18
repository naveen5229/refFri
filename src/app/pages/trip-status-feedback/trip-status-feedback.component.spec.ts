import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripStatusFeedbackComponent } from './trip-status-feedback.component';

describe('TripStatusFeedbackComponent', () => {
  let component: TripStatusFeedbackComponent;
  let fixture: ComponentFixture<TripStatusFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripStatusFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripStatusFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
