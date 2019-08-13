import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripExpenseTallyComponent } from './trip-expense-tally.component';

describe('TripExpenseTallyComponent', () => {
  let component: TripExpenseTallyComponent;
  let fixture: ComponentFixture<TripExpenseTallyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripExpenseTallyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripExpenseTallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
