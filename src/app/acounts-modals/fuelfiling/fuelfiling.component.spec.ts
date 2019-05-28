import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelfilingComponent } from './fuelfiling.component';

describe('FuelfilingComponent', () => {
  let component: FuelfilingComponent;
  let fixture: ComponentFixture<FuelfilingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelfilingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelfilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
