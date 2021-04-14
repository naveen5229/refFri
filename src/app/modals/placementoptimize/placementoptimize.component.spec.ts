import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementoptimizeComponent } from './Placementoptimize.component';

describe('PlacementoptimizationComponent', () => {
  let component: PlacementoptimizeComponent;
  let fixture: ComponentFixture<PlacementoptimizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementoptimizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementoptimizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
