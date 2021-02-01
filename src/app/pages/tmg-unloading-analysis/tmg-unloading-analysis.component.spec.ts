import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgUnloadingAnalysisComponent } from './tmg-unloading-analysis.component';

describe('TmgUnloadingAnalysisComponent', () => {
  let component: TmgUnloadingAnalysisComponent;
  let fixture: ComponentFixture<TmgUnloadingAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmgUnloadingAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TmgUnloadingAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
