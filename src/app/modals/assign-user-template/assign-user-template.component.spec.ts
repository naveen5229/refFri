import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUserTemplateComponent } from './assign-user-template.component';

describe('AssignUserTemplateComponent', () => {
  let component: AssignUserTemplateComponent;
  let fixture: ComponentFixture<AssignUserTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignUserTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignUserTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
