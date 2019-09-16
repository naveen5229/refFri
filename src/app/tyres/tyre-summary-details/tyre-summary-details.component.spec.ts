import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreSummaryDetailsComponent } from './tyre-summary-details.component';

describe('TyreSummaryDetailsComponent', () => {
  let component: TyreSummaryDetailsComponent;
  let fixture: ComponentFixture<TyreSummaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyreSummaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyreSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
