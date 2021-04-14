import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UlheatmapComponent } from './ulheatmap.component';

describe('UlheatmapComponent', () => {
  let component: UlheatmapComponent;
  let fixture: ComponentFixture<UlheatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UlheatmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UlheatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
