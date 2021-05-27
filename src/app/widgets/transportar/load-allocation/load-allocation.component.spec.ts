import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadAllocationComponent } from './load-allocation.component';

describe('LoadAllocationComponent', () => {
  let component: LoadAllocationComponent;
  let fixture: ComponentFixture<LoadAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
