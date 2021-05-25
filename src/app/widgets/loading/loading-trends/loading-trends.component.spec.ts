import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingTrendsComponent } from './loading-trends.component';

describe('LoadingTrendsComponent', () => {
  let component: LoadingTrendsComponent;
  let fixture: ComponentFixture<LoadingTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingTrendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
