import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestAlertNotCalledComponent } from './longest-alert-not-called.component';

describe('LongestAlertNotCalledComponent', () => {
  let component: LongestAlertNotCalledComponent;
  let fixture: ComponentFixture<LongestAlertNotCalledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestAlertNotCalledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestAlertNotCalledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
