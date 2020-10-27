import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoclsummaryComponent } from './stoclsummary.component';

describe('StoclsummaryComponent', () => {
  let component: StoclsummaryComponent;
  let fixture: ComponentFixture<StoclsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoclsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoclsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
