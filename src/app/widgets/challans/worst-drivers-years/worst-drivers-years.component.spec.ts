import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstDriversYearsComponent } from './worst-drivers-years.component';

describe('WorstDriversYearsComponent', () => {
  let component: WorstDriversYearsComponent;
  let fixture: ComponentFixture<WorstDriversYearsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstDriversYearsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstDriversYearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
