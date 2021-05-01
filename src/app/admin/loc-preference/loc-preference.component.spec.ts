import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocPreferenceComponent } from './loc-preference.component';

describe('LocPreferenceComponent', () => {
  let component: LocPreferenceComponent;
  let fixture: ComponentFixture<LocPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocPreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
