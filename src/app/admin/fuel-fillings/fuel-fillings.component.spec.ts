import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelFillingsComponent } from './fuel-fillings.component';

describe('FuelFillingsComponent', () => {
  let component: FuelFillingsComponent;
  let fixture: ComponentFixture<FuelFillingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelFillingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelFillingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
