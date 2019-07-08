import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFreightExpensesComponent } from './add-freight-expenses.component';

describe('AddFreightExpensesComponent', () => {
  let component: AddFreightExpensesComponent;
  let fixture: ComponentFixture<AddFreightExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFreightExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFreightExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
