import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestRechargeComponent } from './latest-recharge.component';

describe('LatestRechargeComponent', () => {
  let component: LatestRechargeComponent;
  let fixture: ComponentFixture<LatestRechargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestRechargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
