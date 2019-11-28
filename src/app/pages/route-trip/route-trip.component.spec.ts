import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteTripComponent } from './route-trip.component';

describe('RouteTripComponent', () => {
  let component: RouteTripComponent;
  let fixture: ComponentFixture<RouteTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
