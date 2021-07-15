import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgLoadingTimeGraphComponent } from './avg-loading-time-graph.component';

describe('AvgLoadingTimeGraphComponent', () => {
  let component: AvgLoadingTimeGraphComponent;
  let fixture: ComponentFixture<AvgLoadingTimeGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvgLoadingTimeGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgLoadingTimeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
