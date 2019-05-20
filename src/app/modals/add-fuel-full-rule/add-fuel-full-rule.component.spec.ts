import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFuelFullRuleComponent } from './add-fuel-full-rule.component';

describe('AddFuelFullRuleComponent', () => {
  let component: AddFuelFullRuleComponent;
  let fixture: ComponentFixture<AddFuelFullRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFuelFullRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFuelFullRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
