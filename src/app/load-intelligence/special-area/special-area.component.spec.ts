import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialAreaComponent } from './special-area.component';

describe('SpecialAreaComponent', () => {
  let component: SpecialAreaComponent;
  let fixture: ComponentFixture<SpecialAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
