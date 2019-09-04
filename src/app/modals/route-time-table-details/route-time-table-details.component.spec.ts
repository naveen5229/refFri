import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteTimeTableDetailsComponent } from './route-time-table-details.component';

describe('RouteTimeTableDetailsComponent', () => {
  let component: RouteTimeTableDetailsComponent;
  let fixture: ComponentFixture<RouteTimeTableDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteTimeTableDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteTimeTableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
