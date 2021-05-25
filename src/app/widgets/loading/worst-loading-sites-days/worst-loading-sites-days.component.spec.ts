import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstLoadingSitesDaysComponent } from './worst-loading-sites-days.component';

describe('WorstLoadingSitesDaysComponent', () => {
  let component: WorstLoadingSitesDaysComponent;
  let fixture: ComponentFixture<WorstLoadingSitesDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstLoadingSitesDaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstLoadingSitesDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
