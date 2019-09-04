import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripPnlComponent } from './trip-pnl.component';

describe('TripPnlComponent', () => {
  let component: TripPnlComponent;
  let fixture: ComponentFixture<TripPnlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripPnlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
