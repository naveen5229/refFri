import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsEnabledDisabledComponent } from './gps-enabled-disabled.component';

describe('GpsEnabledDisabledComponent', () => {
  let component: GpsEnabledDisabledComponent;
  let fixture: ComponentFixture<GpsEnabledDisabledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpsEnabledDisabledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsEnabledDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
