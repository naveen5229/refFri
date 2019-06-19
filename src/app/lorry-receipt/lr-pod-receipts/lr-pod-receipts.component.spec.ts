import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LrPodReceiptsComponent } from './lr-pod-receipts.component';

describe('LrPodReceiptsComponent', () => {
  let component: LrPodReceiptsComponent;
  let fixture: ComponentFixture<LrPodReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LrPodReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LrPodReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
