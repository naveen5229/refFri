import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportFormatsComponent } from './add-report-formats.component';

describe('AddReportFormatsComponent', () => {
  let component: AddReportFormatsComponent;
  let fixture: ComponentFixture<AddReportFormatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReportFormatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReportFormatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
