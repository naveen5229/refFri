import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotspotSummaryComponent } from './hotspot-summary.component';

describe('HotspotSummaryComponent', () => {
  let component: HotspotSummaryComponent;
  let fixture: ComponentFixture<HotspotSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotspotSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotspotSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
