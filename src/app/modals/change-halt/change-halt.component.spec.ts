import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeHaltComponent } from './change-halt.component';

describe('ChangeHaltComponent', () => {
  let component: ChangeHaltComponent;
  let fixture: ComponentFixture<ChangeHaltComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeHaltComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeHaltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
