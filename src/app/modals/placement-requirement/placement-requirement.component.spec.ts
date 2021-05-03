import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementRequirementComponent } from './placement-requirement.component';

describe('PlacementRequirementComponent', () => {
  let component: PlacementRequirementComponent;
  let fixture: ComponentFixture<PlacementRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementRequirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
