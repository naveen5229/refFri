import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPersonalInfoComponent } from './driver-personal-info.component';

describe('DriverPersonalInfoComponent', () => {
  let component: DriverPersonalInfoComponent;
  let fixture: ComponentFixture<DriverPersonalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverPersonalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
