import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgUnloadingTatComponent } from './avg-unloading-tat.component';

describe('AvgUnloadingTatComponent', () => {
  let component: AvgUnloadingTatComponent;
  let fixture: ComponentFixture<AvgUnloadingTatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvgUnloadingTatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgUnloadingTatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
