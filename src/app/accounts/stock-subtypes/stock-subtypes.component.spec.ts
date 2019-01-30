import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSubtypesComponent } from './stock-subtypes.component';

describe('StockSubtypesComponent', () => {
  let component: StockSubtypesComponent;
  let fixture: ComponentFixture<StockSubtypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockSubtypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSubtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
