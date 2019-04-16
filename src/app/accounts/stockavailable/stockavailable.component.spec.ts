import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockavailableComponent } from './stockavailable.component';

describe('StockavailableComponent', () => {
  let component: StockavailableComponent;
  let fixture: ComponentFixture<StockavailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockavailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockavailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
