import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateServiceTesterComponent } from './date-service-tester.component';

describe('DateServiceTesterComponent', () => {
  let component: DateServiceTesterComponent;
  let fixture: ComponentFixture<DateServiceTesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateServiceTesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateServiceTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
