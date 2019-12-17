import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelDailyCunsumtionConditionComponent } from './fuel-daily-cunsumtion-condition.component';

describe('FuelDailyCunsumtionConditionComponent', () => {
  let component: FuelDailyCunsumtionConditionComponent;
  let fixture: ComponentFixture<FuelDailyCunsumtionConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelDailyCunsumtionConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelDailyCunsumtionConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
