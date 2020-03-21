import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersWonComponent } from './orders-won.component';

describe('OrdersWonComponent', () => {
  let component: OrdersWonComponent;
  let fixture: ComponentFixture<OrdersWonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersWonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersWonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
