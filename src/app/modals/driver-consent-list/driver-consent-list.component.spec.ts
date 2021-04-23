import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverConsentListComponent } from './driver-consent-list.component';

describe('DriverConsentListComponent', () => {
  let component: DriverConsentListComponent;
  let fixture: ComponentFixture<DriverConsentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverConsentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverConsentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
