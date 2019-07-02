import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightRevenueComponent } from './freight-revenue.component';

describe('FreightRevenueComponent', () => {
  let component: FreightRevenueComponent;
  let fixture: ComponentFixture<FreightRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreightRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
