import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementCostComponent } from './placement-cost.component';

describe('PlacementCostComponent', () => {
  let component: PlacementCostComponent;
  let fixture: ComponentFixture<PlacementCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
