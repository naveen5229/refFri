import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFuelIndentComponent } from './add-fuel-indent.component';

describe('AddFuelIndentComponent', () => {
  let component: AddFuelIndentComponent;
  let fixture: ComponentFixture<AddFuelIndentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFuelIndentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFuelIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
