import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCallHistoryComponent } from './user-call-history.component';

describe('UserCallHistoryComponent', () => {
  let component: UserCallHistoryComponent;
  let fixture: ComponentFixture<UserCallHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCallHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCallHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
