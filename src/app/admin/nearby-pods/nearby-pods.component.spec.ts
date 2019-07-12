import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyPodsComponent } from './nearby-pods.component';

describe('NearbyPodsComponent', () => {
  let component: NearbyPodsComponent;
  let fixture: ComponentFixture<NearbyPodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearbyPodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearbyPodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
