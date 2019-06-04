import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollUsageSummaryComponent } from './toll-usage-summary.component';

describe('TollUsageSummaryComponent', () => {
  let component: TollUsageSummaryComponent;
  let fixture: ComponentFixture<TollUsageSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollUsageSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollUsageSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
