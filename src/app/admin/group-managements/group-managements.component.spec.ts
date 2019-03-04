import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupManagementsComponent } from './group-managements.component';

describe('GroupManagementsComponent', () => {
  let component: GroupManagementsComponent;
  let fixture: ComponentFixture<GroupManagementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupManagementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
