import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertRelatedIssueComponent } from './alert-related-issue.component';

describe('AlertRelatedIssueComponent', () => {
  let component: AlertRelatedIssueComponent;
  let fixture: ComponentFixture<AlertRelatedIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertRelatedIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertRelatedIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
