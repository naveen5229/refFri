import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverStatusChangeComponent } from './driver-status-change.component';

describe('DriverStatusChangeComponent', () => {
  let component: DriverStatusChangeComponent;
  let fixture: ComponentFixture<DriverStatusChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverStatusChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverStatusChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
