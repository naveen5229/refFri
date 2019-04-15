import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSiteRuleComponent } from './add-site-rule.component';

describe('AddSiteRuleComponent', () => {
  let component: AddSiteRuleComponent;
  let fixture: ComponentFixture<AddSiteRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSiteRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSiteRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
