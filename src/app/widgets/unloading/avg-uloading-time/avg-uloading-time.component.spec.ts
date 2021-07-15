import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgUloadingTimeComponent } from './avg-uloading-time.component';

describe('AvgUloadingTimeComponent', () => {
  let component: AvgUloadingTimeComponent;
  let fixture: ComponentFixture<AvgUloadingTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvgUloadingTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgUloadingTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
