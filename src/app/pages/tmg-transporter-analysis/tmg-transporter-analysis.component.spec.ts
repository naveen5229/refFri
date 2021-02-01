import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgTransporterAnalysisComponent } from './tmg-transporter-analysis.component';

describe('TmgTransporterAnalysisComponent', () => {
  let component: TmgTransporterAnalysisComponent;
  let fixture: ComponentFixture<TmgTransporterAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmgTransporterAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TmgTransporterAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
