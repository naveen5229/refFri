import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailHoldsComponent } from './trail-holds.component';

describe('TrailHoldsComponent', () => {
  let component: TrailHoldsComponent;
  let fixture: ComponentFixture<TrailHoldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailHoldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailHoldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
