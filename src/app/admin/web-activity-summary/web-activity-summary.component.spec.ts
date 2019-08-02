import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebActivitySummaryComponent } from './web-activity-summary.component';

describe('WebActivitySummaryComponent', () => {
  let component: WebActivitySummaryComponent;
  let fixture: ComponentFixture<WebActivitySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebActivitySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebActivitySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
