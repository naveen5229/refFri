import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestUnloadingSitesComponent } from './longest-unloading-sites.component';

describe('LongestUnloadingSitesComponent', () => {
  let component: LongestUnloadingSitesComponent;
  let fixture: ComponentFixture<LongestUnloadingSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestUnloadingSitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestUnloadingSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
