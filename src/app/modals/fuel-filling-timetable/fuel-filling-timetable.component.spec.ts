import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelFillingTimetableComponent } from './fuel-filling-timetable.component';

describe('FuelFillingTimetableComponent', () => {
  let component: FuelFillingTimetableComponent;
  let fixture: ComponentFixture<FuelFillingTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelFillingTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelFillingTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
