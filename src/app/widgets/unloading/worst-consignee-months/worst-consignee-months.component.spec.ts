import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstConsigneeMonthsComponent } from './worst-consignee-months.component';

describe('WorstConsigneeMonthsComponent', () => {
  let component: WorstConsigneeMonthsComponent;
  let fixture: ComponentFixture<WorstConsigneeMonthsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstConsigneeMonthsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstConsigneeMonthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
