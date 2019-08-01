import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStockExchangeComponent } from './manage-stock-exchange.component';

describe('ManageStockExchangeComponent', () => {
  let component: ManageStockExchangeComponent;
  let fixture: ComponentFixture<ManageStockExchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStockExchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStockExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
