import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDistanceComponent } from './driver-distance.component';

describe('DriverDistanceComponent', () => {
  let component: DriverDistanceComponent;
  let fixture: ComponentFixture<DriverDistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverDistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
