import { TestBed } from '@angular/core/testing';

import { HttpResponseHandlerService } from './http-response-handler.service';

describe('HttpResponseHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpResponseHandlerService = TestBed.get(HttpResponseHandlerService);
    expect(service).toBeTruthy();
  });
});
