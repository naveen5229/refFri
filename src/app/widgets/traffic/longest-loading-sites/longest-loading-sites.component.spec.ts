import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestLoadingSitesComponent } from './longest-loading-sites.component';

describe('LongestLoadingSitesComponent', () => {
  let component: LongestLoadingSitesComponent;
  let fixture: ComponentFixture<LongestLoadingSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestLoadingSitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestLoadingSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
