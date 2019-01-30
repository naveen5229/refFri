import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSubtypeComponent } from './stock-subtype.component';

describe('StockSubtypeComponent', () => {
  let component: StockSubtypeComponent;
  let fixture: ComponentFixture<StockSubtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockSubtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSubtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
