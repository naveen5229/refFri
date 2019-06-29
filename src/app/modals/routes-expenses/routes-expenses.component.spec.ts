import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesExpensesComponent } from './routes-expenses.component';

describe('RoutesExpensesComponent', () => {
  let component: RoutesExpensesComponent;
  let fixture: ComponentFixture<RoutesExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
