import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementDelayFaultsComponent } from './placement-delay-faults.component';

describe('PlacementDelayFaultsComponent', () => {
  let component: PlacementDelayFaultsComponent;
  let fixture: ComponentFixture<PlacementDelayFaultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacementDelayFaultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementDelayFaultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
