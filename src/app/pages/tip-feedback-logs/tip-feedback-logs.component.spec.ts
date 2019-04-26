import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipFeedbackLogsComponent } from './tip-feedback-logs.component';

describe('TipFeedbackLogsComponent', () => {
  let component: TipFeedbackLogsComponent;
  let fixture: ComponentFixture<TipFeedbackLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipFeedbackLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipFeedbackLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
