import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestPendingVscTatComponent } from './longest-pending-vsc-tat.component';

describe('LongestPendingVscTatComponent', () => {
  let component: LongestPendingVscTatComponent;
  let fixture: ComponentFixture<LongestPendingVscTatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestPendingVscTatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestPendingVscTatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
