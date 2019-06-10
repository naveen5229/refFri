import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleTollReportComponent } from './double-toll-report.component';

describe('DoubleTollReportComponent', () => {
  let component: DoubleTollReportComponent;
  let fixture: ComponentFixture<DoubleTollReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubleTollReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleTollReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
