import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoFuelAverageComponent } from './fo-fuel-average.component';

describe('FoFuelAverageComponent', () => {
  let component: FoFuelAverageComponent;
  let fixture: ComponentFixture<FoFuelAverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoFuelAverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoFuelAverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
