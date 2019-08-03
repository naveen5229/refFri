import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoWebViewSummaryComponent } from './fo-web-view-summary.component';

describe('FoWebViewSummaryComponent', () => {
  let component: FoWebViewSummaryComponent;
  let fixture: ComponentFixture<FoWebViewSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoWebViewSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoWebViewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
