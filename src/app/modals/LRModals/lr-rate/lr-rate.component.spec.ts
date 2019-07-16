import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LrRateComponent } from './lr-rate.component';

describe('LrRateComponent', () => {
  let component: LrRateComponent;
  let fixture: ComponentFixture<LrRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LrRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LrRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
