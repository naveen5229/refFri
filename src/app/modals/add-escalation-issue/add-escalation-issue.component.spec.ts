import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEscalationIssueComponent } from './add-escalation-issue.component';

describe('AddEscalationIssueComponent', () => {
  let component: AddEscalationIssueComponent;
  let fixture: ComponentFixture<AddEscalationIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEscalationIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEscalationIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
