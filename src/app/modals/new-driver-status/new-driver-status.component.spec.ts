import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDriverStatusComponent } from './new-driver-status.component';

describe('NewDriverStatusComponent', () => {
  let component: NewDriverStatusComponent;
  let fixture: ComponentFixture<NewDriverStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDriverStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDriverStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
