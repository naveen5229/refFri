import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorUserAssociationComponent } from './supervisor-user-association.component';

describe('SupervisorUserAssociationComponent', () => {
  let component: SupervisorUserAssociationComponent;
  let fixture: ComponentFixture<SupervisorUserAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorUserAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorUserAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
