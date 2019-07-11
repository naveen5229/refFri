import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LrAssignComponent } from './lr-assign.component';

describe('LrAssignComponent', () => {
  let component: LrAssignComponent;
  let fixture: ComponentFixture<LrAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LrAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LrAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
