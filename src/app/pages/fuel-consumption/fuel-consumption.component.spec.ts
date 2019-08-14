import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelConsumptionComponent } from './fuel-consumption.component';

describe('FuelConsumptionComponent', () => {
  let component: FuelConsumptionComponent;
  let fixture: ComponentFixture<FuelConsumptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelConsumptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
