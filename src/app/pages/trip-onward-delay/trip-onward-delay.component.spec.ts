import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripOnwardDelayComponent } from './trip-onward-delay.component';

describe('TripOnwardDelayComponent', () => {
  let component: TripOnwardDelayComponent;
  let fixture: ComponentFixture<TripOnwardDelayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripOnwardDelayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripOnwardDelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
