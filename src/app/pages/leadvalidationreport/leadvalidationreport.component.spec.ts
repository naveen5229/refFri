import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadvalidationreportComponent } from './leadvalidationreport.component';

describe('LeadvalidationreportComponent', () => {
  let component: LeadvalidationreportComponent;
  let fixture: ComponentFixture<LeadvalidationreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadvalidationreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadvalidationreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
