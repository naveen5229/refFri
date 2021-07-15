import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestOnwardHaltComponent } from './longest-onward-halt.component';

describe('LongestOnwardHaltComponent', () => {
  let component: LongestOnwardHaltComponent;
  let fixture: ComponentFixture<LongestOnwardHaltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestOnwardHaltComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestOnwardHaltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
