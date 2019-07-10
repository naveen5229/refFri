import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatterySummaryComponent } from './battery-summary.component';

describe('BatterySummaryComponent', () => {
  let component: BatterySummaryComponent;
  let fixture: ComponentFixture<BatterySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatterySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatterySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
