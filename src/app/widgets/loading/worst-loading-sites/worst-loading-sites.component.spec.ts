import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstLoadingSitesComponent } from './worst-loading-sites.component';

describe('WorstLoadingSitesComponent', () => {
  let component: WorstLoadingSitesComponent;
  let fixture: ComponentFixture<WorstLoadingSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstLoadingSitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstLoadingSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
