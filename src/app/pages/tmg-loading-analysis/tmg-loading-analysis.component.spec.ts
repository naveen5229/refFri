import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgLoadingAnalysisComponent } from './tmg-loading-analysis.component';

describe('TmgLoadingAnalysisComponent', () => {
  let component: TmgLoadingAnalysisComponent;
  let fixture: ComponentFixture<TmgLoadingAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmgLoadingAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TmgLoadingAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
