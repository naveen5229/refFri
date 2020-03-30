import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTripManagementComponent } from './order-trip-management.component';

describe('OrderTripManagementComponent', () => {
  let component: OrderTripManagementComponent;
  let fixture: ComponentFixture<OrderTripManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderTripManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTripManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
