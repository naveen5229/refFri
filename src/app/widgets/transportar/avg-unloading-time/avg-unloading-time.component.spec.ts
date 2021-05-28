import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgUnloadingTimeComponent } from './avg-unloading-time.component';

describe('AvgUnloadingTimeComponent', () => {
  let component: AvgUnloadingTimeComponent;
  let fixture: ComponentFixture<AvgUnloadingTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvgUnloadingTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgUnloadingTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
