import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TollpaymentmanagementComponent } from './tollpaymentmanagement.component';

describe('TollpaymentmanagementComponent', () => {
  let component: TollpaymentmanagementComponent;
  let fixture: ComponentFixture<TollpaymentmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TollpaymentmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TollpaymentmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
