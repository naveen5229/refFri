import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripSiteRuleComponent } from './trip-site-rule.component';

describe('TripSiteRuleComponent', () => {
  let component: TripSiteRuleComponent;
  let fixture: ComponentFixture<TripSiteRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripSiteRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripSiteRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
