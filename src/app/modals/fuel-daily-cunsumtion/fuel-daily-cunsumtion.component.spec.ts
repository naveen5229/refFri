import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelDailyCunsumtionComponent } from './fuel-daily-cunsumtion.component';

describe('FuelDailyCunsumtionComponent', () => {
  let component: FuelDailyCunsumtionComponent;
  let fixture: ComponentFixture<FuelDailyCunsumtionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelDailyCunsumtionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelDailyCunsumtionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
