import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgTripComponent } from './tmg-trip.component';

describe('TmgTripComponent', () => {
  let component: TmgTripComponent;
  let fixture: ComponentFixture<TmgTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmgTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmgTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
