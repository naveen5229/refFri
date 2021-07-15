import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgUnloadingComponent } from './avg-unloading.component';

describe('AvgUnloadingComponent', () => {
  let component: AvgUnloadingComponent;
  let fixture: ComponentFixture<AvgUnloadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvgUnloadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgUnloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
