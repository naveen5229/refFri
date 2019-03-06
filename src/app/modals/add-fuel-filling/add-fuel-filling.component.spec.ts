import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFuelFillingComponent } from './add-fuel-filling.component';

describe('AddFuelFillingComponent', () => {
  let component: AddFuelFillingComponent;
  let fixture: ComponentFixture<AddFuelFillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFuelFillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFuelFillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
