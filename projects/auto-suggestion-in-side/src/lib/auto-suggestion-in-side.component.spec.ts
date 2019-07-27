import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSuggestionInSideComponent } from './auto-suggestion-in-side.component';

describe('AutoSuggestionInSideComponent', () => {
  let component: AutoSuggestionInSideComponent;
  let fixture: ComponentFixture<AutoSuggestionInSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoSuggestionInSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoSuggestionInSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
