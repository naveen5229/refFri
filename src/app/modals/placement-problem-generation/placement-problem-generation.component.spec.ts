import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementProblemGenerationComponent } from './placement-problem-generation.component';

describe('PlacementProblemGenerationComponent', () => {
  let component: PlacementProblemGenerationComponent;
  let fixture: ComponentFixture<PlacementProblemGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementProblemGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementProblemGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
