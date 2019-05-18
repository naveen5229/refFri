import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Walle8Component } from './walle8.component';

describe('Walle8Component', () => {
  let component: Walle8Component;
  let fixture: ComponentFixture<Walle8Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Walle8Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Walle8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
