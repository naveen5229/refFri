import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementOptimisationOnMapComponent } from './placement-optimisation-on-map.component';

describe('PlacementOptimisationOnMapComponent', () => {
  let component: PlacementOptimisationOnMapComponent;
  let fixture: ComponentFixture<PlacementOptimisationOnMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementOptimisationOnMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementOptimisationOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
