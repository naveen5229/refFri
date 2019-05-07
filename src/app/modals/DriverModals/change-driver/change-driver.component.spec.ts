import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDriverComponent } from './change-driver.component';

describe('ChangeDriverComponent', () => {
  let component: ChangeDriverComponent;
  let fixture: ComponentFixture<ChangeDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
