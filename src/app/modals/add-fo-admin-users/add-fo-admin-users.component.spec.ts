import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFoAdminUsersComponent } from './add-fo-admin-users.component';

describe('AddFoAdminUsersComponent', () => {
  let component: AddFoAdminUsersComponent;
  let fixture: ComponentFixture<AddFoAdminUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFoAdminUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFoAdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
