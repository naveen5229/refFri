import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestDriverUnavailableComponent } from './longest-driver-unavailable.component';

describe('LongestDriverUnavailableComponent', () => {
  let component: LongestDriverUnavailableComponent;
  let fixture: ComponentFixture<LongestDriverUnavailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestDriverUnavailableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestDriverUnavailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
