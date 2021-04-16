import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementConstraintsComponent } from './placement-constraints.component';

describe('PlacementConstraintsComponent', () => {
  let component: PlacementConstraintsComponent;
  let fixture: ComponentFixture<PlacementConstraintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementConstraintsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementConstraintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
