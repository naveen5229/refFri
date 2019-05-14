import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripVerifyStatesComponent } from './trip-verify-states.component';

describe('TripVerifyStatesComponent', () => {
  let component: TripVerifyStatesComponent;
  let fixture: ComponentFixture<TripVerifyStatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripVerifyStatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripVerifyStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
