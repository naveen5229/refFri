import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryInventoryComponent } from './battery-inventory.component';

describe('BatteryInventoryComponent', () => {
  let component: BatteryInventoryComponent;
  let fixture: ComponentFixture<BatteryInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatteryInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
