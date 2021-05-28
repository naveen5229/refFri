import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetentionTrendComponent } from './detention-trend.component';

describe('DetentionTrendComponent', () => {
  let component: DetentionTrendComponent;
  let fixture: ComponentFixture<DetentionTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetentionTrendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetentionTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
