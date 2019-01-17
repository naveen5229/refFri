import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationMarkerComponent } from './location-marker.component';

describe('LocationMarkerComponent', () => {
  let component: LocationMarkerComponent;
  let fixture: ComponentFixture<LocationMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
