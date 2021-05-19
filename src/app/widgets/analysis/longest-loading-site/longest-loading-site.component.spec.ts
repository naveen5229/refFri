import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestLoadingSiteComponent } from './longest-loading-site.component';

describe('LongestLoadingSiteComponent', () => {
  let component: LongestLoadingSiteComponent;
  let fixture: ComponentFixture<LongestLoadingSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestLoadingSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestLoadingSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
