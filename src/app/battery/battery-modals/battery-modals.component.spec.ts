import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryModalsComponent } from './battery-modals.component';

describe('BatteryModalsComponent', () => {
  let component: BatteryModalsComponent;
  let fixture: ComponentFixture<BatteryModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatteryModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
