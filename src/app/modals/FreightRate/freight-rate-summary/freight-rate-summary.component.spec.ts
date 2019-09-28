import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightRateSummaryComponent } from './freight-rate-summary.component';

describe('FreightRateSummaryComponent', () => {
  let component: FreightRateSummaryComponent;
  let fixture: ComponentFixture<FreightRateSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightRateSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightRateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
