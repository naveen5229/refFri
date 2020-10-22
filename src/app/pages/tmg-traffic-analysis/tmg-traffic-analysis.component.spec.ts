import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgTrafficAnalysisComponent } from './tmg-traffic-analysis.component';

describe('TmgTrafficAnalysisComponent', () => {
  let component: TmgTrafficAnalysisComponent;
  let fixture: ComponentFixture<TmgTrafficAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmgTrafficAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TmgTrafficAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
