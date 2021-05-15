import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTrafficStatusComponent } from './live-traffic-status.component';

describe('LiveTrafficStatusComponent', () => {
  let component: LiveTrafficStatusComponent;
  let fixture: ComponentFixture<LiveTrafficStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveTrafficStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveTrafficStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
