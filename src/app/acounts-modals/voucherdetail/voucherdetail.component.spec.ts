import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherdetailComponent } from './voucherdetail.component';

describe('VoucherdetailComponent', () => {
  let component: VoucherdetailComponent;
  let fixture: ComponentFixture<VoucherdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
