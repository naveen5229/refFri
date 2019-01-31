import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockitemsComponent } from './stockitems.component';

describe('StockitemsComponent', () => {
  let component: StockitemsComponent;
  let fixture: ComponentFixture<StockitemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockitemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
