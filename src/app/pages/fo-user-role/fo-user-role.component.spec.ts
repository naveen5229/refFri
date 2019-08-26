import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoUserRoleComponent } from './fo-user-role.component';

describe('FoUserRoleComponent', () => {
  let component: FoUserRoleComponent;
  let fixture: ComponentFixture<FoUserRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoUserRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
