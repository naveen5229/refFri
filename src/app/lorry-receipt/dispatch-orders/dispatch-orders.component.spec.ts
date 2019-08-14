import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchOrdersComponent } from './dispatch-orders.component';

describe('DispatchOrdersComponent', () => {
  let component: DispatchOrdersComponent;
  let fixture: ComponentFixture<DispatchOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
