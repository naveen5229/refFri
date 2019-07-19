import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LrPodDetailsComponent } from './lr-pod-details.component';

describe('LrPodDetailsComponent', () => {
  let component: LrPodDetailsComponent;
  let fixture: ComponentFixture<LrPodDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LrPodDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LrPodDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
