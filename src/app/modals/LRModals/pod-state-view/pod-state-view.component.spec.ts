import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodStateViewComponent } from './pod-state-view.component';

describe('PodStateViewComponent', () => {
  let component: PodStateViewComponent;
  let fixture: ComponentFixture<PodStateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodStateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodStateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
