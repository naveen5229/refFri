import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelDailyConsumptionComponent } from './fuel-daily-consumption.component';

describe('FuelDailyConsumptionComponent', () => {
  let component: FuelDailyConsumptionComponent;
  let fixture: ComponentFixture<FuelDailyConsumptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelDailyConsumptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelDailyConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
