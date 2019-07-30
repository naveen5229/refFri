import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericInputTypeComponent } from './generic-input-type.component';

describe('GenericInputTypeComponent', () => {
  let component: GenericInputTypeComponent;
  let fixture: ComponentFixture<GenericInputTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericInputTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericInputTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
