import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestOpenAlertComponent } from './longest-open-alert.component';

describe('LongestOpenAlertComponent', () => {
  let component: LongestOpenAlertComponent;
  let fixture: ComponentFixture<LongestOpenAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestOpenAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestOpenAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
