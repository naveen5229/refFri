import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCallSummaryComponent } from './user-call-summary.component';

describe('UserCallSummaryComponent', () => {
  let component: UserCallSummaryComponent;
  let fixture: ComponentFixture<UserCallSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCallSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCallSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
