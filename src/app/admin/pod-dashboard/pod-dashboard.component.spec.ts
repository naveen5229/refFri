import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodDashboardComponent } from './pod-dashboard.component';

describe('PodDashboardComponent', () => {
  let component: PodDashboardComponent;
  let fixture: ComponentFixture<PodDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
