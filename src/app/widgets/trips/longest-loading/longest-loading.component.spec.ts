import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestLoadingComponent } from './longest-loading.component';

describe('LongestLoadingComponent', () => {
  let component: LongestLoadingComponent;
  let fixture: ComponentFixture<LongestLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
