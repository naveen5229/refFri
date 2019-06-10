import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlacementSiteRuleComponent } from './add-placement-site-rule.component';

describe('AddPlacementSiteRuleComponent', () => {
  let component: AddPlacementSiteRuleComponent;
  let fixture: ComponentFixture<AddPlacementSiteRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlacementSiteRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlacementSiteRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
