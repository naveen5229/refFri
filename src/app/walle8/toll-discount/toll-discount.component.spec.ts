import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollDiscountComponent } from './toll-discount.component';

describe('TollDiscountComponent', () => {
  let component: TollDiscountComponent;
  let fixture: ComponentFixture<TollDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
