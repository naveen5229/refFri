import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSuggestionComponent } from './generic-suggestion.component';

describe('GenericSuggestionComponent', () => {
  let component: GenericSuggestionComponent;
  let fixture: ComponentFixture<GenericSuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericSuggestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
