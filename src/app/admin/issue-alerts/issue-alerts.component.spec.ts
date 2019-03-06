import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueAlertsComponent } from './issue-alerts.component';

describe('IssueAlertsComponent', () => {
  let component: IssueAlertsComponent;
  let fixture: ComponentFixture<IssueAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
