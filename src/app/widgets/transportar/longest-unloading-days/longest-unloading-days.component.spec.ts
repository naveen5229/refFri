import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestUnloadingDaysComponent } from './longest-unloading-days.component';

describe('LongestUnloadingDaysComponent', () => {
  let component: LongestUnloadingDaysComponent;
  let fixture: ComponentFixture<LongestUnloadingDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestUnloadingDaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestUnloadingDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
