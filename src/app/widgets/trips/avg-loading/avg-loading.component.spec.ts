import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgLoadingComponent } from './avg-loading.component';

describe('AvgLoadingComponent', () => {
  let component: AvgLoadingComponent;
  let fixture: ComponentFixture<AvgLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvgLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
