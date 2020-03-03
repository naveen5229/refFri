import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardusageComponent } from './cardusage.component';

describe('CardusageComponent', () => {
  let component: CardusageComponent;
  let fixture: ComponentFixture<CardusageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardusageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardusageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
