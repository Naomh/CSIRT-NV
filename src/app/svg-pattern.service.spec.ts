import { TestBed } from '@angular/core/testing';

import { SvgPatternService } from './svg-pattern.service';

describe('SvgPatternService', () => {
  let service: SvgPatternService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SvgPatternService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
