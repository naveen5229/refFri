import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViaRoutePointsComponent } from './via-route-points.component';

describe('ViaRoutePointsComponent', () => {
  let component: ViaRoutePointsComponent;
  let fixture: ComponentFixture<ViaRoutePointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViaRoutePointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViaRoutePointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
