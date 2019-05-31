import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidateFuelAverageComponent } from './consolidate-fuel-average.component';

describe('ConsolidateFuelAverageComponent', () => {
  let component: ConsolidateFuelAverageComponent;
  let fixture: ComponentFixture<ConsolidateFuelAverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidateFuelAverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidateFuelAverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
