import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PullHistoryGPSDataComponent } from './pull-history-gps-data.component';

describe('PullHistoryGPSDataComponent', () => {
  let component: PullHistoryGPSDataComponent;
  let fixture: ComponentFixture<PullHistoryGPSDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PullHistoryGPSDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PullHistoryGPSDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
