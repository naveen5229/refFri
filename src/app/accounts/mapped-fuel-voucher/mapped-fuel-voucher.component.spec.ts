import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappedFuelVoucherComponent } from './mapped-fuel-voucher.component';

describe('MappedFuelVoucherComponent', () => {
  let component: MappedFuelVoucherComponent;
  let fixture: ComponentFixture<MappedFuelVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappedFuelVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappedFuelVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
