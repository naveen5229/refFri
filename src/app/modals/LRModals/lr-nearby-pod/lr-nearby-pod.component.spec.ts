import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LrNearbyPodComponent } from './lr-nearby-pod.component';

describe('LrNearbyPodComponent', () => {
  let component: LrNearbyPodComponent;
  let fixture: ComponentFixture<LrNearbyPodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LrNearbyPodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LrNearbyPodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
