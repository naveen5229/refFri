import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherTypeGetComponent } from './voucher-type-get.component';

describe('VoucherTypeGetComponent', () => {
  let component: VoucherTypeGetComponent;
  let fixture: ComponentFixture<VoucherTypeGetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherTypeGetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherTypeGetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
