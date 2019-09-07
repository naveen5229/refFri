import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstraintsComponent } from './constraints.component';

describe('ConstraintsComponent', () => {
  let component: ConstraintsComponent;
  let fixture: ComponentFixture<ConstraintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstraintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstraintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
