import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightRateRulesComponent } from './freight-rate-rules.component';

describe('FreightRateRulesComponent', () => {
  let component: FreightRateRulesComponent;
  let fixture: ComponentFixture<FreightRateRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightRateRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightRateRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
