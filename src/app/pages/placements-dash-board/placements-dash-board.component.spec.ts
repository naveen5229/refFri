import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementsDashBoardComponent } from './placements-dash-board.component';

describe('PlacementsDashBoardComponent', () => {
  let component: PlacementsDashBoardComponent;
  let fixture: ComponentFixture<PlacementsDashBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacementsDashBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementsDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
