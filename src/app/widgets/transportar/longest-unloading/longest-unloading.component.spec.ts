import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongestUnloadingComponent } from './longest-unloading.component';

describe('LongestUnloadingComponent', () => {
  let component: LongestUnloadingComponent;
  let fixture: ComponentFixture<LongestUnloadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongestUnloadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongestUnloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
