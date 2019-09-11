import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvsLrAssignComponent } from './mvs-lr-assign.component';

describe('MvsLrAssignComponent', () => {
  let component: MvsLrAssignComponent;
  let fixture: ComponentFixture<MvsLrAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvsLrAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvsLrAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
