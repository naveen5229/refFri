import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDeviationsComponent } from './route-deviations.component';

describe('RouteDeviationsComponent', () => {
  let component: RouteDeviationsComponent;
  let fixture: ComponentFixture<RouteDeviationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteDeviationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteDeviationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
