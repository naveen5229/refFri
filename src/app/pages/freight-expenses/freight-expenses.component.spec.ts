import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightExpensesComponent } from './freight-expenses.component';

describe('FreightExpensesComponent', () => {
  let component: FreightExpensesComponent;
  let fixture: ComponentFixture<FreightExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
