import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDispatchOrderComponent } from './add-dispatch-order.component';

describe('AddDispatchOrderComponent', () => {
  let component: AddDispatchOrderComponent;
  let fixture: ComponentFixture<AddDispatchOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDispatchOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDispatchOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
