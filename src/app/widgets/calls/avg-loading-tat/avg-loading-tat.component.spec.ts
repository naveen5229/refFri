import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgLoadingTatComponent } from './avg-loading-tat.component';

describe('AvgLoadingTatComponent', () => {
  let component: AvgLoadingTatComponent;
  let fixture: ComponentFixture<AvgLoadingTatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvgLoadingTatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgLoadingTatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
