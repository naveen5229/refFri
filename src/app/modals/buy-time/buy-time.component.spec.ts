import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyTimeComponent } from './buy-time.component';

describe('BuyTimeComponent', () => {
  let component: BuyTimeComponent;
  let fixture: ComponentFixture<BuyTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
