import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EWayBillTripComponent } from './e-way-bill-trip.component';

describe('EWayBillTripComponent', () => {
  let component: EWayBillTripComponent;
  let fixture: ComponentFixture<EWayBillTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EWayBillTripComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EWayBillTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
