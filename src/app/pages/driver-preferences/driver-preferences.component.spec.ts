import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPreferencesComponent } from './driver-preferences.component';

describe('DriverPreferencesComponent', () => {
  let component: DriverPreferencesComponent;
  let fixture: ComponentFixture<DriverPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverPreferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
