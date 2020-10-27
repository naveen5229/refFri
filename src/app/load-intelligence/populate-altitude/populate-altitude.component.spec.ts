import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulateAltitudeComponent } from './populate-altitude.component';

describe('PopulateAltitudeComponent', () => {
  let component: PopulateAltitudeComponent;
  let fixture: ComponentFixture<PopulateAltitudeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopulateAltitudeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopulateAltitudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
