import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteTripDetailsComponent } from './site-trip-details.component';

describe('SiteTripDetailsComponent', () => {
  let component: SiteTripDetailsComponent;
  let fixture: ComponentFixture<SiteTripDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteTripDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteTripDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
