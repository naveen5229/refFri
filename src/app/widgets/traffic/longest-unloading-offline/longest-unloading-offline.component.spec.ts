import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestUnloadingOfflineComponent } from './longest-unloading-offline.component';

describe('LongestUnloadingOfflineComponent', () => {
  let component: LongestUnloadingOfflineComponent;
  let fixture: ComponentFixture<LongestUnloadingOfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestUnloadingOfflineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestUnloadingOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
