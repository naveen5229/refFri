import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripVerificationComponent } from './trip-verification.component';

describe('TripVerificationComponent', () => {
  let component: TripVerificationComponent;
  let fixture: ComponentFixture<TripVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
