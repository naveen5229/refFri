import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvErrorReportComponent } from './csv-error-report.component';

describe('CsvErrorReportComponent', () => {
  let component: CsvErrorReportComponent;
  let fixture: ComponentFixture<CsvErrorReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvErrorReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvErrorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
