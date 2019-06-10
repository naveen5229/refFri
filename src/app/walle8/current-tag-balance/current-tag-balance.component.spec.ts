import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTagBalanceComponent } from './current-tag-balance.component';

describe('CurrentTagBalanceComponent', () => {
  let component: CurrentTagBalanceComponent;
  let fixture: ComponentFixture<CurrentTagBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentTagBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentTagBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
