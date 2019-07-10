import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFreightRevenueComponent } from './add-freight-revenue.component';

describe('AddFreightRevenueComponent', () => {
  let component: AddFreightRevenueComponent;
  let fixture: ComponentFixture<AddFreightRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFreightRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFreightRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
