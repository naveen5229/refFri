import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialbalanceComponent } from './trialbalance.component';

describe('TrialbalanceComponent', () => {
  let component: TrialbalanceComponent;
  let fixture: ComponentFixture<TrialbalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialbalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
