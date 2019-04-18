import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivityStatusComponent } from './user-activity-status.component';

describe('UserActivityStatusComponent', () => {
  let component: UserActivityStatusComponent;
  let fixture: ComponentFixture<UserActivityStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserActivityStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserActivityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
