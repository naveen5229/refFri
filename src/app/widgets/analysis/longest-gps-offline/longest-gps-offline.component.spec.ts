import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestGpsOfflineComponent } from './longest-gps-offline.component';

describe('LongestGpsOfflineComponent', () => {
  let component: LongestGpsOfflineComponent;
  let fixture: ComponentFixture<LongestGpsOfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestGpsOfflineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestGpsOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
