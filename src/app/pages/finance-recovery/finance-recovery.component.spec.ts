import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceRecoveryComponent } from './finance-recovery.component';

describe('FinanceRecoveryComponent', () => {
  let component: FinanceRecoveryComponent;
  let fixture: ComponentFixture<FinanceRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
