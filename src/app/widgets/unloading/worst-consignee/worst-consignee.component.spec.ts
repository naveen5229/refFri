import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstConsigneeComponent } from './worst-consignee.component';

describe('WorstConsigneeComponent', () => {
  let component: WorstConsigneeComponent;
  let fixture: ComponentFixture<WorstConsigneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstConsigneeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstConsigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
