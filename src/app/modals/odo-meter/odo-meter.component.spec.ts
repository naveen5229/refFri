import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdoMeterComponent } from './odo-meter.component';

describe('OdoMeterComponent', () => {
  let component: OdoMeterComponent;
  let fixture: ComponentFixture<OdoMeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdoMeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdoMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
