import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdhocRouteComponent } from './adhoc-route.component';

describe('AdhocRouteComponent', () => {
  let component: AdhocRouteComponent;
  let fixture: ComponentFixture<AdhocRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdhocRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdhocRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
