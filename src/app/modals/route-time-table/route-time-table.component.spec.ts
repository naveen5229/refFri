import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteTimeTableComponent } from './route-time-table.component';

describe('RouteTimeTableComponent', () => {
  let component: RouteTimeTableComponent;
  let fixture: ComponentFixture<RouteTimeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteTimeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
