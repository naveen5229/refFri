import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestAlertNotAckComponent } from './longest-alert-not-ack.component';

describe('LongestAlertNotAckComponent', () => {
  let component: LongestAlertNotAckComponent;
  let fixture: ComponentFixture<LongestAlertNotAckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestAlertNotAckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestAlertNotAckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
