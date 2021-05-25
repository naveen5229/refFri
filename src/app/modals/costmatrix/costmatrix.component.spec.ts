import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostmatrixComponent } from './costmatrix.component';

describe('CostmatrixComponent', () => {
  let component: CostmatrixComponent;
  let fixture: ComponentFixture<CostmatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostmatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostmatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
