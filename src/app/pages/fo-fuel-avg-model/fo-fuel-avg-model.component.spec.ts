import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoFuelAvgModelComponent } from './fo-fuel-avg-model.component';

describe('FoFuelAvgModelComponent', () => {
  let component: FoFuelAvgModelComponent;
  let fixture: ComponentFixture<FoFuelAvgModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoFuelAvgModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoFuelAvgModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
