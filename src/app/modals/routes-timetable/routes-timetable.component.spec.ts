import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesTimetableComponent } from './routes-timetable.component';

describe('RoutesTimetableComponent', () => {
  let component: RoutesTimetableComponent;
  let fixture: ComponentFixture<RoutesTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
