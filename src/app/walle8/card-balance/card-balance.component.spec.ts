import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBalanceComponent } from './card-balance.component';

describe('CardBalanceComponent', () => {
  let component: CardBalanceComponent;
  let fixture: ComponentFixture<CardBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
