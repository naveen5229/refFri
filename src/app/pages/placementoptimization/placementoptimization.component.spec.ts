import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementoptimizationComponent } from './placementoptimization.component';

describe('PlacementoptimizationComponent', () => {
  let component: PlacementoptimizationComponent;
  let fixture: ComponentFixture<PlacementoptimizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementoptimizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementoptimizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
