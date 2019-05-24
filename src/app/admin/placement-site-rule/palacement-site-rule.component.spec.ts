import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PalacementSiteRuleComponent } from './palacement-site-rule.component';

describe('PalacementSiteRuleComponent', () => {
  let component: PalacementSiteRuleComponent;
  let fixture: ComponentFixture<PalacementSiteRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PalacementSiteRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PalacementSiteRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
