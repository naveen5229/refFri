import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchereditedComponent } from './voucheredited.component';

describe('VouchereditedComponent', () => {
  let component: VouchereditedComponent;
  let fixture: ComponentFixture<VouchereditedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VouchereditedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchereditedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
