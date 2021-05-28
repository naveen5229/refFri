import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowestLoadsComponent } from './lowest-loads.component';

describe('LowestLoadsComponent', () => {
  let component: LowestLoadsComponent;
  let fixture: ComponentFixture<LowestLoadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LowestLoadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LowestLoadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
