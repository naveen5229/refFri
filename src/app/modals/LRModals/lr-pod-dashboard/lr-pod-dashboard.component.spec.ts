import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LrPodDashboardComponent } from './lr-pod-dashboard.component';

describe('LrPodDashboardComponent', () => {
  let component: LrPodDashboardComponent;
  let fixture: ComponentFixture<LrPodDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LrPodDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LrPodDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
