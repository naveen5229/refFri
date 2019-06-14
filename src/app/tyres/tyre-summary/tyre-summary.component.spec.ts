import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreSummaryComponent } from './tyre-summary.component';

describe('TyreSummaryComponent', () => {
  let component: TyreSummaryComponent;
  let fixture: ComponentFixture<TyreSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyreSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyreSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
