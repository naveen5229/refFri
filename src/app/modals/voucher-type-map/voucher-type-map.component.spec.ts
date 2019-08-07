import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherTypeMapComponent } from './voucher-type-map.component';

describe('VoucherTypeMapComponent', () => {
  let component: VoucherTypeMapComponent;
  let fixture: ComponentFixture<VoucherTypeMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherTypeMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherTypeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
