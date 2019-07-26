import { TestBed } from '@angular/core/testing';

import { AutoSuggestionInSideService } from './auto-suggestion-in-side.service';

describe('AutoSuggestionInSideService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AutoSuggestionInSideService = TestBed.get(AutoSuggestionInSideService);
    expect(service).toBeTruthy();
  });
});
