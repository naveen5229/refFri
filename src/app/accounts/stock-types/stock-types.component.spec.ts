import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTypesComponent } from './stock-types.component';

describe('StockTypesComponent', () => {
  let component: StockTypesComponent;
  let fixture: ComponentFixture<StockTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
