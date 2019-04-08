import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverCallSuggestionComponent } from './driver-call-suggestion.component';

describe('DriverCallSuggestionComponent', () => {
  let component: DriverCallSuggestionComponent;
  let fixture: ComponentFixture<DriverCallSuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverCallSuggestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverCallSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
