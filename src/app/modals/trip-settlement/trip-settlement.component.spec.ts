import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripSettlementComponent } from './trip-settlement.component';

describe('TripSettlementComponent', () => {
  let component: TripSettlementComponent;
  let fixture: ComponentFixture<TripSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
