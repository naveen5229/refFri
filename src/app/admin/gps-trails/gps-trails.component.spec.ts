import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsTrailsComponent } from './gps-trails.component';

describe('GpsTrailsComponent', () => {
  let component: GpsTrailsComponent;
  let fixture: ComponentFixture<GpsTrailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpsTrailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsTrailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
