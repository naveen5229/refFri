import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBoardsComponent } from './order-boards.component';

describe('OrderBoardsComponent', () => {
  let component: OrderBoardsComponent;
  let fixture: ComponentFixture<OrderBoardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBoardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
