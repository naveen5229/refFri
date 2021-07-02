import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcellyRemappingRouteComponent } from './forcelly-remapping-route.component';

describe('ForcellyRemappingRouteComponent', () => {
  let component: ForcellyRemappingRouteComponent;
  let fixture: ComponentFixture<ForcellyRemappingRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForcellyRemappingRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcellyRemappingRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
