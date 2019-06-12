import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelEditComponent } from './fuel-edit.component';

describe('FuelEditComponent', () => {
  let component: FuelEditComponent;
  let fixture: ComponentFixture<FuelEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
